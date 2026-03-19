import {useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';
import {TOOLS} from '@/utils/constants';
import type {ToolName} from '@/types/data';
import {normalizeToolIssueCount} from '@/utils/compute';
import type {OverviewChartsProps} from '@/types/components';

export const OverviewChart = (props: OverviewChartsProps) => {
  const {report} = props || {};
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const tools = Object.entries(report?.tools || {});
      const sortedTools = tools.sort((a, b) => {
        const aTotal = normalizeToolIssueCount(a[1]);
        const bTotal = normalizeToolIssueCount(b[1]);
        return bTotal - aTotal;
      });
      const labels = sortedTools.map(([name]) => TOOLS[name as ToolName].label);
      const errors = sortedTools.map(([, t]) => t.summary?.errors || 0);
      const warnings = sortedTools.map(([, t]) => t.summary?.warnings || 0);
      const chart = new Chart(ref.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Errors',
              data: errors,
              backgroundColor: '#ef4444',
              stack: 'issues',
              borderRadius: 6,
            },
            {
              label: 'Warnings',
              data: warnings,
              backgroundColor: '#f59e0b',
              stack: 'issues',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {labels: {color: '#cbd5e1'}},
            tooltip: {
              callbacks: {
                footer(items) {
                  const i = items[0]?.dataIndex ?? 0;
                  const total = (errors[i] || 0) + (warnings[i] || 0);
                  return `Total: ${total}`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {color: '#aeb8c5'},
              grid: {display: false},
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {color: '#aeb8c5', precision: 0},
              grid: {color: 'rgba(255,255,255,0.08)'},
            },
          },
        },
      });

      return () => chart.destroy();
    }
  }, [report]);

  return <canvas ref={ref} />;
};
