import type {Issue, Report, ReportData, Tool, ToolName} from '@/types/data';
import {
  REPORTS_PATH,
  TOOL_KEYS_LABEL,
  TOOLS,
  TOOLS_ISSUES_KEYS,
} from '@/utils/constants';

export const getHealthInfo = (score: number) => {
  if (score >= 90) return {label: 'Healthy', status: 'ok'};
  if (score >= 75) return {label: 'Warning', status: 'warn'};
  return {label: 'Critical', status: 'error'};
};

export const normalizeToolIssueCount = (tool: Tool | null | undefined) => {
  return (tool?.summary?.errors || 0) + (tool?.summary?.warnings || 0);
};

export const getJSONToolPath = (toolPath: string) => {
  return `${REPORTS_PATH}/${toolPath}`;
};

export const getHeatLevel = (value: number) => {
  if (value === 0) return {className: 'heat-low', label: String(value)};
  if (value <= 3) return {className: 'heat-mid', label: String(value)};
  return {className: 'heat-high', label: String(value)};
};

export const buildIssues = (current: ReportData): Issue[] => {
  const issues: any[] = [];
  const {tools: currentTools} = current || {};
  for (const [name, tool] of Object.entries(currentTools)) {
    const toolName = name as ToolName;
    const {summary} = tool || {};
    for (const [key, value = 0] of Object.entries(summary || {})) {
      const field = key as keyof (typeof TOOLS_ISSUES_KEYS)[typeof toolName];
      if (value && Object.keys(TOOLS_ISSUES_KEYS[toolName]).includes(field)) {
        const {lib} = TOOLS[toolName];
        const severity = TOOLS_ISSUES_KEYS[toolName][field];
        const title = TOOL_KEYS_LABEL[toolName][field];
        const description = `${value} issues detected by ${lib}`;
        const search = `${toolName} ${key} ${severity} ${title} ${description}`;
        issues.push({severity, title, description, value, search});
      }
    }
  }
  const rank: any = {error: 0, warn: 1};
  return issues.sort((a, b) => rank[a.severity] - rank[b.severity]);
};

export const getSortedReports = (reports: Report[]) => {
  return reports.sort((a, b) => {
    const at = new Date(a.data?.meta?.date || 0).getTime();
    const bt = new Date(b.data?.meta?.date || 0).getTime();
    return at - bt;
  });
};
