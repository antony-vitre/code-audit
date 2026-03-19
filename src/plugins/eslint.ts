import {execCmd} from '../core/exec.js';
import {createPlugin} from '../core/createPlugin.js';

const count = (arr: any[], key: string): number => {
  return arr.reduce((acc, item) => acc + (item[key] ?? 0), 0);
};

export const eslintPlugin = createPlugin({
  name: 'eslint',
  async run({cwd, config, logger}) {
    const patterns = (typeof config.tools.eslint === 'boolean'
      ? ['.']
      : config.tools.eslint.patterns) ?? ['.'];
    logger.verboseLog('    🧹 ESLint patterns:', patterns);
    const res = await execCmd('eslint', [...patterns, '-f', 'json'], {
      cwd,
      logger,
    });
    const data = JSON.parse(res.stdout ?? '[]');
    const errors = count(data, 'errorCount');
    const warnings = count(data, 'warningCount');
    const status = errors > 0 ? 'error' : warnings > 0 ? 'warn' : 'ok';
    logger.verboseLog(
      `    🔎 ESLint found ${errors} error(s) and ${warnings} warning(s)`,
    );
    return {status, summary: {errors, warnings}, data};
  },
});
