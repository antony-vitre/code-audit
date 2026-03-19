import path from 'node:path';
import sirv from 'sirv';
import http from 'node:http';
import open from 'open';

export const startDashboard = async (cwd: string) => {
  const reportsDir = path.join(cwd, 'reports');
  const serv = sirv(reportsDir);
  const port = 8888;
  const server = http.createServer((req, res) => serv(req, res));
  server.listen(port);
  const url = `http://localhost:${port}/code-audit/index.html`;
  console.log(`📊 Dashboard running at: ${url}`);
  await open(url);
};
