import {execCmd} from '../core/exec.js';
import path from 'node:path';
import {createPlugin} from '../core/createPlugin.js';
import defaultConfig from '../config/defaultConfig.js';
import {writeJsonReport} from '../core/writeJsonReport.js';

const Type = [
  'unusedFiles',
  'unusedExports',
  'unusedDependencies',
  'unusedDevDependencies',
] as const;
type Type = (typeof Type)[number];

const getMetadata = (result: {files?: string[]; issues?: any[]}) => {
  const {files, issues} = result || {};
  const meta: Record<Type, number> = {
    unusedFiles: files?.length ?? 0,
    unusedExports: 0,
    unusedDependencies: 0,
    unusedDevDependencies: 0,
  };
  if (issues) {
    for (const i of issues) {
      meta.unusedExports += i?.exports?.length ?? 0;
      meta.unusedDependencies += i?.dependencies?.length ?? 0;
      meta.unusedDevDependencies += i?.devDependencies?.length ?? 0;
    }
  }
  return meta;
};

export const knipPlugin = createPlugin({
  name: 'knip',
  async run({cwd, config, runDir, logger}) {
    const knipConfig = config.tools.knip ?? defaultConfig.tools.knip;
    const configPath = path.join(runDir, 'knip.config.json');
    writeJsonReport(runDir, 'knip.config', knipConfig);
    const res = await execCmd(
      'npx',
      ['--package=knip', 'knip', '--config', configPath, '--reporter', 'json'],
      {cwd, logger},
    );
    const data = JSON.parse(res.stdout ?? '{}');
    const {
      unusedFiles,
      unusedExports,
      unusedDependencies,
      unusedDevDependencies,
    } = getMetadata(data);
    const total =
      unusedFiles + unusedExports + unusedDependencies + unusedDevDependencies;
    logger.verboseLog(`    🔎 Knip found ${total} issue(s)`);
    unusedFiles > 0 &&
      logger.verboseLog(`        Unused files: ${unusedFiles}`);
    unusedExports > 0 &&
      logger.verboseLog(`        Unused exports: ${unusedExports}`);
    unusedDependencies > 0 &&
      logger.verboseLog(`        Unused dependencies: ${unusedDependencies}`);
    unusedDevDependencies > 0 &&
      logger.verboseLog(
        `        Unused dev dependencies: ${unusedDevDependencies}`,
      );
    const errors = unusedFiles + unusedDependencies;
    const warnings = unusedDevDependencies + unusedExports;
    return {
      status: errors > 0 ? 'error' : warnings > 0 ? 'warn' : 'ok',
      summary: {
        errors,
        warnings,
        unusedFiles,
        unusedExports,
        unusedDependencies,
        unusedDevDependencies,
      },
      data,
    };
  },
});
