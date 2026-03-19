import type {SelectProps, TopBarProps} from '@/types/components';
import {SELECT_PREFIX} from '@/utils/constants';
import {formatDate} from '@/utils/format';

const Select = (props: SelectProps) => {
  const {reports, label, value, onChange, prefix, exclude} = props || {};
  return (
    <div className="field">
      <label>{label}</label>
      <select
        className="control"
        value={value}
        onChange={(e) => onChange(e.target.value)}>
        {prefix === SELECT_PREFIX.COMPARE ? (
          <option key={`${prefix}_none`} value={'none'}>
            {`None`}
          </option>
        ) : null}
        {reports.map((report) => {
          const {data, id} = report;
          const {meta} = data || {};
          const {date, runId} = meta || {};
          const options: Intl.DateTimeFormatOptions = {
            dateStyle: 'short',
            timeStyle: 'short',
          };
          return (
            <option
              disabled={exclude === id}
              key={`${prefix}_${id}`}
              value={id}>
              {`Code audit · ${formatDate(date, options)} (${runId})`}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const Topbar = (props: TopBarProps) => {
  const {
    reports,
    currentReportId,
    compareReportId,
    onChangeCurrent,
    onChangeCompare,
  } = props || {};
  return (
    <header className="topbar">
      <div className="brand">
        <div>
          <h1 id="pageTitle">Code Audit · Dashboard</h1>
        </div>
      </div>
      <div className="toolbar">
        <Select
          reports={reports}
          label={'Current Audit'}
          value={currentReportId || ''}
          onChange={(reportId: string) => {
            onChangeCurrent(reportId);
            if (reportId === compareReportId) {
              onChangeCompare('');
            }
          }}
          prefix={SELECT_PREFIX.CURRENT}
        />
        <Select
          reports={reports}
          label={'Compare with'}
          value={compareReportId || ''}
          onChange={onChangeCompare}
          prefix={SELECT_PREFIX.COMPARE}
          exclude={currentReportId || ''}
        />
      </div>
    </header>
  );
};
