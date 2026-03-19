import {useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';
import {getHealthInfo} from '@/utils/compute';
import type {HealthInfoProps} from '@/types/components';
import {formatDate, formatDuration} from '@/utils/format';

export const HealthInfo = (props: HealthInfoProps) => {
  const {report} = props || {};
  const {meta, scores} = report || {};
  const ref = useRef<HTMLCanvasElement | null>(null);
  const score = scores?.health?.score || 0;
  const {project, runId, date, duration} = meta || {};
  useEffect(() => {
    if (ref.current) {
      const chart = new Chart(ref.current, {
        type: 'doughnut',
        data: {
          datasets: [{data: [score, Math.max(0, 100 - score)], borderWidth: 0}],
        },
        options: {
          cutout: '76%',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {legend: {display: false}, tooltip: {enabled: false}},
        },
      });
      return () => chart.destroy();
    }
  }, [score]);
  const {label, status} = getHealthInfo(score);
  return (
    <div className="panel overview-right">
      <div className="health-card">
        <div className="section-mini-head">
          <h3>Health score</h3>
          <span className={`badge badge-${status}`}>{label}</span>
        </div>
        <div className="health-main">
          <div className="score-canvas-wrap">
            <canvas ref={ref} />
            <div className="score-center">
              <div className="score-number">{score}</div>
              <div className="score-over">/ 100</div>
            </div>
          </div>
          <div className="health-copy">
            <p>Health score based on detected issues and their severity.</p>
          </div>
        </div>
      </div>
      <div className="panel inset-panel">
        <div className="section-mini-head">
          <h3>Context</h3>
        </div>
        <div id="metaList" className="meta-list">
          <div className="meta-row">
            <div className="meta-key">Project</div>
            <div className="meta-value">{project || '—'}</div>
          </div>
          <div className="meta-row">
            <div className="meta-key">ID</div>
            <div className="meta-value">{runId || '—'}</div>
          </div>
          <div className="meta-row">
            <div className="meta-key">Date</div>
            <div className="meta-value">
              {formatDate(date, {dateStyle: 'short', timeStyle: 'short'})}
            </div>
          </div>
          <div className="meta-row">
            <div className="meta-key">Duration</div>
            <div className="meta-value">{formatDuration(duration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
