import {execCmd} from '../core/exec.js';
import {AuditToolConfig} from '../types/config.js';
import {createPlugin} from '../core/createPlugin.js';

const Severity = ['info', 'low', 'moderate', 'high', 'critical'] as const;
type Severity = (typeof Severity)[number];

const severityRank = (s: Severity): number => {
  return Severity.indexOf(s);
};

const ndjsonToJson = (ndjson: string): any[] => {
  const linesWithComma = ndjson.trim().replace(/(!?\r?\n)+/g, ',');
  return JSON.parse(`[${linesWithComma}]`);
};

const getMetadata = (
  vulnerabilities: any[],
  threshold: number = severityRank('high'),
) => {
  let errors = 0;
  let warnings = 0;
  let counts: Record<Severity, number> = {
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
  };
  for (const v of vulnerabilities) {
    const type = v?.children?.Severity;
    type && Severity.includes(type) && counts[type as Severity]++;
    threshold <= severityRank(type) ? errors++ : warnings++;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return {counts, total, errors, warnings};
};

export const AuditPlugin = createPlugin({
  name: 'audit',
  async run({cwd, config, logger}) {
    const toolConfig: AuditToolConfig =
      typeof config.tools.audit === 'object' ? config.tools.audit : {};
    const level = toolConfig.level ?? 'high';
    const all = toolConfig.all ?? true;
    const args = ['npm', 'audit', '--json'];
    all && args.push('--all');

    logger.verboseLog(`    🔒 Dependency audit: level=${level}, all=${all}`);
    const res = await execCmd('yarn', args, {cwd, logger});

    if (res.notFound) {
      return {
        enabled: true,
        status: 'skipped',
        message: 'yarn not found.',
        summary: {errors: 0, warnings: 0},
        report: '',
      };
    }
    const vulnerabilities = ndjsonToJson(res.all);
    const threshold = severityRank(level);
    const {counts, total, errors, warnings} = getMetadata(
      vulnerabilities,
      threshold,
    );
    const hasError =
      (counts.critical > 0 && threshold <= severityRank('critical')) ||
      (counts.high > 0 && threshold <= severityRank('high')) ||
      (counts.moderate > 0 && threshold <= severityRank('moderate')) ||
      (counts.low > 0 && threshold <= severityRank('low')) ||
      (counts.info > 0 && threshold <= severityRank('info'));

    logger.verboseLog(`    🔎 Audit found ${total} vulnerability(ies)`);
    if (total > 0) {
      logger.verboseLog(`        Critical: ${counts.critical}`);
      logger.verboseLog(`        High: ${counts.high}`);
      logger.verboseLog(`        Moderate: ${counts.moderate}`);
      logger.verboseLog(`        Low: ${counts.low}`);
      logger.verboseLog(`        Info: ${counts.info}`);
    }

    const status = hasError ? 'error' : total > 0 ? 'warn' : 'ok';
    return {
      status,
      message:
        status === 'ok'
          ? 'No known vulnerabilities found.'
          : status === 'warn'
            ? 'Vulnerabilities found (below configured threshold).'
            : `Vulnerabilities found (>= ${level}).`,
      summary: {...counts, errors, warnings, vulnerabilities: total},
      data: vulnerabilities,
    };
  },
});
