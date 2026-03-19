import fs from 'node:fs';
import {join} from 'node:path';

export const writeJsonReport = (
  runDir: string,
  name: string,
  data: unknown,
) => {
  const file = `${name}.json`;
  const path = join(runDir, file);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  return file;
};
