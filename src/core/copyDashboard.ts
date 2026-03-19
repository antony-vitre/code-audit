import {cpSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const copyDashboard = (reportsDir: string) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const source = path.resolve(__dirname, '../assets');
  cpSync(source, reportsDir, {recursive: true});
};
