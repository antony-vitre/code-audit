import {createPlugin} from '../core/createPlugin.js';
import {execCmd} from '../core/exec.js';
import {MadgeConfig} from '../types/config.js';

export const madgePlugin = createPlugin({
  name: 'madge',
  async run({cwd, config, logger}) {
    const toolConfig: MadgeConfig =
      typeof config.tools.madge === 'object' ? config.tools.madge : {};
    const path = toolConfig.path ?? '.';
    const extensions = toolConfig.extensions ?? ['ts', 'tsx', 'js', 'jsx'];
    const res = await execCmd(
      'npx',
      [
        '--package=madge',
        'madge',
        path,
        '--circular',
        '--json',
        '--extensions',
        extensions.join(','),
      ],
      {cwd, logger},
    );
    const data = JSON.parse(res.stdout ?? '{}');
    const errors = Object.keys(data ?? {}).length;
    logger.verboseLog(`    🔎 Madge found ${errors} circular dependency(ies)`);
    return {
      status: errors > 0 ? 'error' : 'ok',
      summary: {errors, circularDeps: errors},
      data,
    };
  },
});
