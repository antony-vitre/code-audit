import type {Context, Plugin, ToolResult} from '../types/plugins.js';
import {ToolName} from '../types/config.js';
import {writeJsonReport} from './writeJsonReport.js';

export const createPlugin = (tool: {
  name: ToolName;
  run: (ctx: Context) => Promise<ToolResult>;
}): Plugin => {
  return {
    name: tool.name,
    isEnabled(config) {
      return config.tools?.[tool.name] !== false;
    },
    async run(ctx) {
      const start = Date.now();
      try {
        const result = await tool.run(ctx);
        const {data, status, summary: sum, message} = result || {};
        const report = data
          ? writeJsonReport(ctx.runDir, tool.name, data)
          : undefined;
        const summary = sum ?? {};
        const duration = Date.now() - start;
        return {enabled: true, status, summary, report, message, duration};
      } catch (err) {
        ctx.logger.error(`Plugin ${tool.name} crashed`);
        ctx.logger.debugLog(`Plugin ERROR =>`, err);
        const duration = Date.now() - start;
        const message = String(err);
        const status = 'error';
        return {enabled: true, status, summary: {}, message, duration};
      }
    },
  };
};
