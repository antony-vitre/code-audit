import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {TypecheckConfig} from '../types/config.js';
import {createPlugin} from '../core/createPlugin.js';
import {TsDiagnostic} from '../types/plugins.js';

const getDiagnosticsFromConfig = (project: string): TsDiagnostic[] => {
  const configFile = ts.readConfigFile(project, ts.sys.readFile);

  if (configFile.error) {
    return [];
  }

  const config = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(project),
  );

  const program = ts.createProgram({
    rootNames: config.fileNames,
    options: config.options,
  });

  const diagnostics = ts.getPreEmitDiagnostics(program).filter((d) => {
    return !d.file ? true : !d.file.fileName.includes('node_modules');
  });

  return diagnostics.map((d): TsDiagnostic => {
    let file: string | null = null;
    let line: number | null = null;
    let column: number | null = null;

    if (d.file && typeof d.start === 'number') {
      const {line: l, character} = d.file.getLineAndCharacterOfPosition(
        d.start,
      );
      file = d.file.fileName;
      line = l + 1;
      column = character + 1;
    }

    return {
      project,
      file,
      line,
      column,
      code: d.code,
      category: ts.DiagnosticCategory[d.category],
      message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    };
  });
};

export const typecheckPlugin = createPlugin({
  name: 'typecheck',
  async run({cwd, config, logger}) {
    const toolConfig: TypecheckConfig =
      typeof config.tools.typecheck === 'object' ? config.tools.typecheck : {};
    const configs = toolConfig.tsconfigs ?? [];
    const mainConfig = path.join(cwd, 'tsconfig.json');
    const tsconfigs: string[] =
      configs.length === 0
        ? fs.existsSync(mainConfig)
          ? ['tsconfig.json']
          : []
        : configs;
    if (tsconfigs.length === 0) {
      return {
        status: 'skipped',
        message: 'No tsconfig.json found.',
        summary: {errors: 0},
      };
    }
    logger.verboseLog('    📦 Typecheck projects:');
    tsconfigs.forEach((p) => logger.verboseLog('        - Project:', p));
    const allDiagnostics: TsDiagnostic[] = [];
    for (const tsconfig of tsconfigs) {
      const diagnostics = getDiagnosticsFromConfig(tsconfig);
      allDiagnostics.push(...diagnostics);
    }
    const errors = allDiagnostics.filter((d) => d.category === 'Error');
    logger.verboseLog(`    🔎 Typecheck found ${errors.length} error(s)`);
    return {
      status: errors.length > 0 ? 'error' : 'ok',
      summary: {errors: errors.length},
      data: allDiagnostics,
    };
  },
});
