import type {RootData, Report, ReportData} from '@/types/data';
import {ROOT_JSON_PATH} from '@/utils/constants';

const fetchJSON = async (
  path: string,
): Promise<RootData | ReportData | null> => {
  console.info(`Fetch JSON file from path : (${path})...`);
  try {
    const res = await fetch(path);
    const json = res.json();
    console.info('Fetch JSON SUCCESS');
    return json;
  } catch (error) {
    console.error(`Fetch JSON ERROR =>`, error);
    return null;
  }
};

export const fetchData = async (
  setData: React.Dispatch<React.SetStateAction<Report[]>>,
  setHasLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentReportId: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<void> => {
  const rootData = (await fetchJSON(ROOT_JSON_PATH)) as RootData;
  const {reports} = rootData || {};
  if (reports) {
    const reportsData: Report[] = [];
    for (const index in reports) {
      const {id, path, label} = reports[index] || {};
      const data = (await fetchJSON(path)) as ReportData;
      data && reportsData.push({id, label, path, data});
    }
    if (reportsData.length > 0) {
      setData(reportsData);
      setCurrentReportId(reportsData[0].id);
    }
    setHasLoaded(true);
  }
};
