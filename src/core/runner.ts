import fs from 'node:fs';
import path from 'node:path';
import {loadConfig} from '../config/loadConfig.js';
import type {GlobalReport} from '../types/report.js';
import type {Context} from '../types/plugins.js';
import {runPlugins} from './pluginManager.js';
import {computeScores} from './scoring.js';
import {typecheckPlugin} from '../plugins/typecheck.js';
import {eslintPlugin} from '../plugins/eslint.js';
import {Logger} from './logger.js';
import {AuditPlugin} from '../plugins/audit.js';
import {knipPlugin} from '../plugins/knip.js';
import {writeJsonReport} from './writeJsonReport.js';
import {madgePlugin} from '../plugins/madge.js';
import {jscpdPlugin} from '../plugins/jscpd.js';
import {copyDashboard} from './copyDashboard.js';
import {v4 as uuid} from 'uuid';

const ensureDir = (p: string) => {
  fs.mkdirSync(p, {recursive: true});
};

export const run = async (options?: {
  debug?: boolean;
  verbose?: boolean;
  isCI?: boolean;
}): Promise<void> => {
  const {debug = false, verbose = false, isCI = false} = options || {};
  const startedAt = Date.now();
  const cwd = process.cwd();
  const logger = new Logger({debug, verbose});
  const config = await loadConfig(cwd);
  logger.debugLog('Loaded config:', config);

  const reportsDir = path.join(cwd, 'reports');
  const rootDir = path.join(reportsDir, 'code-audit');
  const runsDir = path.join(rootDir, 'runs');
  ensureDir(rootDir);
  ensureDir(runsDir);
  copyDashboard(rootDir);
  const runId = uuid();
  const runDir = path.join(runsDir, runId);
  ensureDir(runDir);
  const context: Context = {cwd, config, runDir, logger};
  const report: GlobalReport = {
    version: 1,
    meta: {date: new Date().toISOString(), project: path.basename(cwd), runId},
    summary: {status: 'ok'},
    scores: {},
    tools: {},
  };

  await runPlugins(
    [
      typecheckPlugin,
      eslintPlugin,
      AuditPlugin,
      knipPlugin,
      madgePlugin,
      jscpdPlugin,
    ],
    context,
    report,
  );

  report.meta.duration = Date.now() - startedAt;

  computeScores(report);
  writeJsonReport(runDir, 'global', report);

  const runs = fs
    .readdirSync(runsDir)
    .filter((f) => fs.statSync(path.join(runsDir, f)).isDirectory())
    .sort()
    .reverse();

  writeJsonReport(rootDir, 'reports', {
    last_report: {id: runId, path: `runs/${runId}/global.json`},
    reports: runs.map((r) => ({
      id: r,
      label: `Code audit · ${r}`,
      path: `./runs/${r}/global.json`,
    })),
  });

  console.log(`✅ Audit written to ${path.relative(cwd, runDir)}/global.json`);
  console.log(
    `🏁 Status: ${report.summary.status} | Health: ${report?.scores?.health?.score || 0}`,
  );
  const exitCode = report.summary.status === 'error' ? 1 : 0;
  logger?.debugLog(`exitCode: ${exitCode}`);
  if (isCI && exitCode !== 0) {
    process.exit(1);
  }
};
