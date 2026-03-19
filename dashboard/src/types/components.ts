import type {Report, ReportData} from '@/types/data';

export type TopBarProps = {
  reports: Report[];
  currentReportId: string | null;
  compareReportId: string | null;
  onChangeCurrent: Function;
  onChangeCompare: Function;
};

export type SelectProps = {
  reports: Report[];
  label: string;
  value: string;
  onChange: Function;
  prefix: string;
  exclude?: string;
};

export type HealthInfoProps = {
  report: ReportData;
};

export type OverviewProps = {
  currentReport: ReportData;
  compareReport: ReportData | null;
};

export type ToolsGridProps = {
  currentReport: ReportData;
  compareReport: ReportData | null;
};

export type ChartsProps = {
  reports: Report[];
};

export type OverviewChartsProps = {
  report: ReportData;
};

export type HeatmapProps = {
  reports: Report[];
};

export type IssuesProps = {
  currentReport: ReportData;
  compareReport: ReportData | null;
};
