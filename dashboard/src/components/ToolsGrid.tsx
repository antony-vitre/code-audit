import type {ToolsGridProps} from '@/types/components';
import type {ToolName} from '@/types/data';
import {normalizeToolIssueCount, getJSONToolPath} from '@/utils/compute';
import {TOOLS} from '@/utils/constants';
import {formatDuration} from '@/utils/format';

const Metric = ({label, value}: {label: string; value: string | number}) => {
  return (
    <div className="metric-card">
      <div className="metric-key">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
};

export const ToolsGrid = (props: ToolsGridProps) => {
  const {currentReport, compareReport} = props || {};
  const currentTools = currentReport?.tools || {};
  const compareTools = compareReport?.tools;
  const tools = Object.entries(currentTools).sort((a, b) => {
    return normalizeToolIssueCount(b[1]) - normalizeToolIssueCount(a[1]);
  });

  return tools.length > 0 ? (
    <div className="tools-grid">
      {tools.map(([name, tool]) => {
        const toolName = name as ToolName;
        const compareTool = compareTools ? compareTools[toolName] : null;
        const {
          summary,
          status = 'info',
          report,
          duration,
          enabled,
          message,
        } = tool || {};
        const errors = summary?.errors || 0;
        const warnings = summary?.warnings || 0;
        const total = errors + warnings;
        const compareTotal = normalizeToolIssueCount(compareTool);
        const delta = compareReport ? total - (compareTotal || 0) : null;
        return (
          <article key={name} className="tool-card">
            <div className="tool-head">
              <div className="tool-name">{TOOLS[toolName].label}</div>
              <span className={`badge badge-${status}`}>
                {status.toUpperCase()}
              </span>
            </div>
            <div className="tool-sub">
              {message || 'No additional message.'}
            </div>
            <div className="tool-metrics">
              <Metric label="Issues" value={total} />
              <Metric label="Delta" value={delta ?? '—'} />
              <Metric label="Errors" value={errors} />
              <Metric label="Warnings" value={warnings} />
              <Metric label="Duration" value={formatDuration(duration)} />
              <Metric label="Enabled" value={enabled ? 'true' : 'false'} />
            </div>
            <div className="tool-foot">
              <div className="tool-sub">
                {compareReport
                  ? `Audit comparison: ${compareTotal || 0} issue(s)`
                  : 'No audit to compare'}
              </div>
              {report && (
                <a
                  className="tool-link"
                  href={getJSONToolPath(report)}
                  target="_blank"
                  rel="noopener noreferrer">
                  Open JSON →
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  ) : (
    <div className="empty">No tools available.</div>
  );
};
