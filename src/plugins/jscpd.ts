import fs from 'node:fs';
import {createPlugin} from '../core/createPlugin.js';
import {execCmd} from '../core/exec.js';
import {JscpdConfig} from '../types/config.js';

export const jscpdPlugin = createPlugin({
  name: 'jscpd',
  async run({cwd, config, runDir, logger}) {
    const toolConfig: JscpdConfig =
      typeof config.tools.jscpd === 'object' ? config.tools.jscpd : {};
    const paths = toolConfig.paths ?? ['.'];
    const pattern = toolConfig.pattern ?? '**/*.{js,ts,tsx}';
    const minTokens = String(toolConfig.minTokens ?? 20);
    const threshold = String(toolConfig.threshold ?? 5);
    const ignore = toolConfig.ignore ?? [
      '**/node_modules/**',
      '**/android/**',
      '**/ios/**',
      '**/reports/code-audit',
    ];
    const output = `${runDir}/jscpd`;
    await execCmd(
      'npx',
      [
        '--yes',
        '--package=jscpd',
        'jscpd',
        ...paths,
        '--min-tokens',
        minTokens,
        '--threshold',
        threshold,
        '--reporters',
        'json,html',
        '--output',
        output,
        '--pattern',
        `${pattern}`,
        '--ignore',
        `${ignore.join(',')}`,
      ],
      {cwd, logger},
    );
    const reportPath = `${output}/jscpd-report.json`;
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const warnings = data.duplicates?.length ?? 0;
    logger.verboseLog(
      `    🔎 Jscpd found ${warnings} duplicate code segment(s)`,
    );
    return {
      status: warnings > 0 ? 'warn' : 'ok',
      summary: {warnings, duplicationCodes: warnings},
      data,
    };
  },
});
