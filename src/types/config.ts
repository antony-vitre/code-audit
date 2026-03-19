export interface JscpdConfig {
  threshold?: number;
  minTokens?: number;
  paths?: string[];
  pattern?: string;
  ignore?: string[];
}

export interface EslintConfig {
  patterns?: string[];
}

export interface TypecheckConfig {
  tsconfigs?: string[];
}

export interface Config {
  tools: ToolsConfig;
}

export interface AuditToolConfig {
  level?: 'info' | 'low' | 'moderate' | 'high' | 'critical';
  all?: boolean;
}

export interface MadgeConfig {
  path?: string;
  extensions?: string[];
}

export type ToolName =
  | 'eslint'
  | 'knip'
  | 'madge'
  | 'typecheck'
  | 'audit'
  | 'jscpd';

export interface ToolsConfig extends Record<ToolName, any> {
  eslint: boolean | EslintConfig;
  knip: boolean | object;
  madge: boolean | MadgeConfig;
  typecheck: boolean | TypecheckConfig;
  audit: boolean | AuditToolConfig;
  jscpd: boolean | JscpdConfig;
}
