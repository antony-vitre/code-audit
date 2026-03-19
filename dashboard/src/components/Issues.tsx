import {useMemo, useState} from 'react';
import {buildIssues} from '@/utils/compute';
import type {IssuesProps} from '@/types/components';
import type {Issue} from '@/types/data';
import {SEVERITIES} from '@/utils/constants';

const IssueCard = ({issue}: {issue: Issue}) => {
  const {severity, title, description, value} = issue || {};
  const dotClass =
    severity === 'error' ? 'error' : severity === 'warning' ? '' : 'ok';
  return (
    <article className="issue-card">
      <span className={`issue-dot ${dotClass}`} />
      <div className="issue-main">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <div className="issue-value">{value}</div>
    </article>
  );
};

export const Issues = (props: IssuesProps) => {
  const {currentReport} = props || {};
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('all');
  const issues = useMemo(() => buildIssues(currentReport), [currentReport]);
  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      const matchSeverity = severity === 'all' || issue.severity === severity;
      const matchQuery =
        !query || issue.search.toLowerCase().includes(query.toLowerCase());
      return matchSeverity && matchQuery;
    });
  }, [issues, query, severity]);
  return (
    <div className="section-body">
      <div className="issues-toolbar">
        <input
          className="control"
          placeholder="Filter issues..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="control"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}>
          {SEVERITIES.map((s) => {
            return (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            );
          })}
        </select>
      </div>
      <div className="issues-list">
        {filtered.length ? (
          filtered.map((issue, i) => <IssueCard key={i} issue={issue} />)
        ) : (
          <div className="empty">No issues match the filter</div>
        )}
      </div>
    </div>
  );
};
