#!/usr/bin/env node

import {run} from '../core/runner.js';
import {startDashboard} from '../dashboard/server.js';

const args = process.argv.slice(2);

if (args[0] === 'dashboard') {
  await startDashboard(process.cwd());
} else {
  const debug = process.argv.includes('--debug');
  const verbose = process.argv.includes('--verbose') || debug;
  const isCI = process.argv.includes('--ci');
  run({debug, verbose, isCI}).catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
}
