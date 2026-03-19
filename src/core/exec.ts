import {execa, type Options as ExecaOptions} from 'execa';
import {Logger} from './logger';
import {ExecResult} from '../types/exec';

export const execCmd = async (
  cmd: string,
  args: string[],
  opts: ExecaOptions & {logger?: Logger} = {},
): Promise<ExecResult> => {
  const {logger, ...xOpts} = opts;
  logger?.debugLog(`    🧪 exec: ${cmd} ${args.join(' ')}`);
  xOpts.cwd && logger?.debugLog(`    cwd: ${xOpts.cwd}`);
  try {
    const res = await execa(cmd, args, {reject: false, all: true, ...xOpts});
    return {
      ok: true,
      exitCode: null,
      stdout: String(res.stdout ?? ''),
      stderr: String(res.stderr ?? ''),
      all: String(res.all ?? ''),
      notFound: false,
    };
  } catch (e: any) {
    logger?.debugLog(`    ❌ command failed to start`);
    return {
      ok: false,
      exitCode: null,
      stdout: '',
      stderr: '',
      all: String(e),
      notFound: e?.code === 'ENOENT',
    };
  }
};
