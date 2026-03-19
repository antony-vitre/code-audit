import type {HeatmapProps} from '@/types/components';
import type {ToolName} from '@/types/data';
import {normalizeToolIssueCount} from '@/utils/compute';
import {getHeatLevel} from '@/utils/compute';
import {TOOLS} from '@/utils/constants';
import {formatDate} from '@/utils/format';

export const Heatmap = (props: HeatmapProps) => {
  const {reports} = props || {};
  const recent = reports.slice(0, 5);
  return recent.length > 0 ? (
    <div
      className="heatmap"
      style={{'--heatmap-cols': recent.length} as React.CSSProperties}>
      <div className="heatmap-row">
        <div className="heatmap-label">Category</div>
        {recent.map((report, i) => (
          <div key={i} className="heatmap-col-label">
            {formatDate(report.data?.meta?.date)}
          </div>
        ))}
      </div>
      {Object.keys(recent[0].data?.tools || {}).map((name) => {
        const toolName = name as ToolName;
        return (
          <div key={toolName} className="heatmap-row">
            <div className="heatmap-label">{TOOLS[toolName].label}</div>
            {recent.map((report, i) => {
              const count = normalizeToolIssueCount(
                report.data?.tools?.[toolName],
              );
              const {className, label} = getHeatLevel(count);
              return (
                <div key={i} className={`heat-cell ${className}`}>
                  {label}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  ) : (
    <div className="empty">Not enough data</div>
  );
};
