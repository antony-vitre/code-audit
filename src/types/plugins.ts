import type {Config, ToolName} from './config.js';
import type {PluginSection, Status} from './report.js';
import type {Logger} from '../core/logger.js';

export interface Context {
  cwd: string;
  config: Config;
  runDir: string;
  logger: Logger;
}

export interface Plugin {
  name: ToolName;
  isEnabled(config: Config): boolean;
  run(context: Context): Promise<PluginSection>;
}
export interface ToolResult {
  status: Status;
  summary?: Record<string, number>;
  data?: unknown;
  message?: string;
}
export interface PluginContext {
  cwd: string;
  runDir: string;
  config: Config;
  logger: Logger;
}

export interface TsDiagnostic {
  project: string;
  file: string | null;
  line: number | null;
  column: number | null;
  code: number;
  category: string;
  message: string;
}
