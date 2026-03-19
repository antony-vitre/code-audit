import {useEffect, useMemo, useState} from 'react';
import type {Report, ReportData} from '@/types/data';
import {fetchData} from '@/utils/fetch';

const getReportData = (
  reports: Report[],
  reportId: string | null,
): ReportData | null => reports.find((r) => r.id === reportId)?.data || null;

export const useReports = () => {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [compareReportId, setCompareReportId] = useState<string | null>(null);

  useEffect(() => {
    fetchData(setReports, setHasLoaded, setCurrentReportId);
  }, []);

  const currentReport = useMemo(
    () => getReportData(reports, currentReportId),
    [reports, currentReportId],
  );

  const compareReport = useMemo(
    () => getReportData(reports, compareReportId),
    [reports, compareReportId],
  );

  return {
    hasLoaded,
    reports,
    setCurrentReportId,
    currentReportId,
    currentReport,
    setCompareReportId,
    compareReportId,
    compareReport,
  };
};
