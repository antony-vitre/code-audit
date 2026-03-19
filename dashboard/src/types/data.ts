import {TOOLS} from '@/utils/constants';

export type ToolSummary = {
  errors?: number;
  warnings?: number;
  vulnerabilities?: number;
  circularDeps?: number;
  duplicationCodes?: number;
};

export type Tool = {
  status?: string;
  summary?: ToolSummary;
  duration?: number;
  enabled?: boolean;
  report?: string;
  message?: string;
};

export type Report = {
  id: string;
  label: string;
  path: string;
  data?: ReportData;
};

export type ToolName = keyof typeof TOOLS;

export type ReportData = {
  meta: {project?: string; runId?: string; date?: string; duration?: number};
  scores: {health?: {score: number}; [key: string]: any};
  tools: Record<ToolName, Tool>;
  summary: {status?: string};
};

export type RootData = {last_report: Report; reports: Report[]};

export type OverviewItem = {
  title: string;
  value: number;
  sub: string;
  delta?: number;
  sign?: '+' | '';
  class?: 'diff-flat' | 'diff-up' | 'diff-down';
};

export type Issue = {
  severity: string;
  title: string;
  description: string;
  value: number;
  search: string;
};
