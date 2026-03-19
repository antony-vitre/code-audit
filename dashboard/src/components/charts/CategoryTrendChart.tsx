import {useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';
import {TOOLS, TREND_CHART_OPTIONS} from '@/utils/constants';
import type {ToolName} from '@/types/data';
import type {ChartsProps} from '@/types/components';
import {getSortedReports, normalizeToolIssueCount} from '@/utils/compute';
import {formatDate} from '@/utils/format';

export const CategoryTrend = (props: ChartsProps) => {
  const {reports} = props || {};
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const sortedReports = getSortedReports(reports);
      const toolNames = Object.keys(sortedReports[0]?.data?.tools || {});
      const labels = sortedReports.map((r) => formatDate(r.data?.meta?.date));
      const datasets = toolNames.map((name) => {
        const toolName = name as ToolName;
        return {
          label: TOOLS[toolName].label,
          data: sortedReports.map((r) => {
            const tool = r.data?.tools[toolName];
            return normalizeToolIssueCount(tool);
          }),
        };
      });
      const chart = new Chart(ref.current, {
        type: 'line',
        data: {labels, datasets},
        options: TREND_CHART_OPTIONS,
      });
      return () => chart.destroy();
    }
  }, [reports]);

  return <canvas ref={ref} />;
};
