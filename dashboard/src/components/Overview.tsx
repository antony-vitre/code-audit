import type {OverviewProps} from '@/types/components';
import type {OverviewItem, ToolName} from '@/types/data';
import {normalizeToolIssueCount} from '@/utils/compute';
import {TOOLS} from '@/utils/constants';

export const Overview = (props: OverviewProps) => {
  const {currentReport, compareReport} = props || {};
  const {tools, scores, summary} = currentReport || {};
  const {status = 'info'} = summary || {};
  const health = scores?.health?.score || 0;
  const delta = health - (compareReport?.scores?.health?.score || 0);
  const items: OverviewItem[] = [
    {
      title: 'Health',
      value: health || 0,
      sub: 'Global score',
      delta,
      sign: delta > 0 ? '+' : '',
      class: `diff-${delta === 0 ? 'flat' : delta > 0 ? 'down' : 'up'}`,
    },
  ];

  for (const [name, tool] of Object.entries(tools)) {
    const toolName = name as ToolName;
    const {title, sub} = TOOLS[toolName];
    const value = normalizeToolIssueCount(tool);
    const item: OverviewItem = {title, value, sub};
    if (compareReport) {
      const compareTool = compareReport.tools[toolName];
      item.delta = value - normalizeToolIssueCount(compareTool);
      item.sign = item.delta > 0 ? '+' : '';
      item.class = `diff-${item.delta === 0 ? 'flat' : item.delta < 0 ? 'down' : 'up'}`;
    }
    items.push(item);
  }

  return (
    <div className="panel overview-left">
      <div className="overview-run">
        <div className="overview-run-copy">
          <h2>Overview</h2>
        </div>
        <div className="overview-status">
          <span className={`badge badge-${status}`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="overview-kpis">
        {items.map((item) => (
          <div key={item.title} className="overview-kpi">
            <div className="overview-kpi-label">{item.title}</div>
            <div className="overview-kpi-value">{item.value}</div>
            <div className="overview-kpi-sub">{item.sub}</div>
          </div>
        ))}
      </div>
      <div className="panel inset-panel">
        <div className="section-mini-head">
          <h3>Differences</h3>
          {compareReport ? (
            <span className="badge badge-info">Current vs comparison</span>
          ) : null}
        </div>
        {compareReport ? (
          <div id="compareList" className="compare-list">
            {items.map((item) => (
              <div key={item.title} className="compare-row">
                <div className="compare-key">{item.title}</div>
                <div className="compare-value">
                  <span className={item.class}>
                    {item.sign}
                    {item.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">
            <span>Select a comparison report to view deltas.</span>
          </div>
        )}
      </div>
    </div>
  );
};
