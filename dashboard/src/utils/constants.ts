const REPORTS_FOLDER = 'runs';
const ROOT_PATH = '.';
const ROOT_JSON_FILE = 'reports.json';

export const TOOLS = {
  typecheck: {title: 'Types', sub: 'Type error(s)', label: 'Types', lib: 'tsc'},
  eslint: {title: 'Lint', sub: 'Issue(s)', label: 'Lint', lib: 'ESLint'},
  audit: {
    title: 'Security',
    sub: 'Vulnerability(ies)',
    label: 'Security',
    lib: 'npm audit',
  },
  knip: {
    title: 'Unused',
    sub: 'Files, exports, deps',
    label: 'Unused Code',
    lib: 'knip',
  },
  madge: {
    title: 'Circular',
    sub: 'Circular deps',
    label: 'Circular Deps',
    lib: 'madge',
  },
  jscpd: {
    title: 'Duplication',
    sub: 'Code duplication',
    label: 'Code Duplication',
    lib: 'jscpd',
  },
};

export const TOOLS_ISSUES_KEYS = {
  eslint: {errors: 'error', warnings: 'warning'},
  typecheck: {errors: 'error'},
  audit: {
    critical: 'error',
    high: 'error',
    moderate: 'warning',
    low: 'warning',
    info: '',
  },
  madge: {circularDeps: 'error'},
  jscpd: {duplicationCodes: 'warning'},
  knip: {
    unusedFiles: 'error',
    unusedExports: 'warning',
    unusedDependencies: 'error',
    unusedDevDependencies: 'warning',
  },
};
export const TOOL_KEYS_LABEL = {
  eslint: {errors: 'Lint errors', warnings: 'Lint warnings'},
  typecheck: {errors: 'Type errors'},
  audit: {
    critical: 'Security (critical)',
    high: 'Security (hight)',
    moderate: 'Security (moderate)',
    low: 'Security (low)',
    info: 'Security (info)',
  },
  madge: {circularDeps: 'Circular depedencies'},
  jscpd: {duplicationCodes: 'Code duplication'},
  knip: {
    unusedFiles: 'Unsused files',
    unusedExports: 'Unused exports',
    unusedDependencies: 'Unused depedencies',
    unusedDevDependencies: 'Unused dev dependencies',
  },
};
export const SEVERITIES = [
  {value: 'all', label: 'All severities'},
  {value: 'error', label: 'Errors'},
  {value: 'warning', label: 'Warnings'},
];
export const ROOT_JSON_PATH = `${ROOT_PATH}/${ROOT_JSON_FILE}`;
export const REPORTS_PATH = `${ROOT_PATH}/${REPORTS_FOLDER}`;
export const SELECT_PREFIX = {CURRENT: 'current', COMPARE: 'compare'} as const;
export const TREND_CHART_OPTIONS: any = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {intersect: false, mode: 'index'},
  plugins: {legend: {labels: {color: '#cbd5e1'}}},
  scales: {
    x: {ticks: {color: '#aeb8c5'}, grid: {display: false}},
    y: {
      beginAtZero: true,
      ticks: {color: '#aeb8c5', precision: 0},
      grid: {color: 'rgba(255,255,255,0.08)'},
    },
  },
};
