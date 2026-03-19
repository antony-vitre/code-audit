import {useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';
import type {Tool} from '@/types/data';
import type {ChartsProps} from '@/types/components';
import {formatDate} from '@/utils/format';
import {TREND_CHART_OPTIONS} from '@/utils/constants';
import {getSortedReports} from '@/utils/compute';

export const AuditTrendChart = (props: ChartsProps) => {
  const {reports} = props || {};
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const sortedReports = getSortedReports(reports);
      const labels = sortedReports.map((r) => formatDate(r.data?.meta?.date));
      const health = sortedReports.map((r) => {
        return r.data?.scores?.health?.score || 0;
      });
      const issues = sortedReports.map((r) => {
        const {data} = r || {};
        const {tools} = data || {};
        return tools
          ? Object.values(tools).reduce((sum: number, tool: Tool) => {
              const {summary} = tool || {};
              const {errors, warnings} = summary || {};
              return sum + (errors || 0) + (warnings || 0);
            }, 0)
          : 0;
      });
      const chart = new Chart(ref.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {label: 'Health', data: health},
            {label: 'Issues', data: issues},
          ],
        },
        options: TREND_CHART_OPTIONS,
      });
      return () => chart.destroy();
    }
  }, [reports]);

  return <canvas ref={ref} />;
};
