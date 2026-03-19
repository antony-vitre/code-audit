import {Config} from '../types/config';

const config: Config = {
  tools: {
    eslint: {patterns: ['.']},
    knip: {workspaces: {'.': {}}},
    madge: {path: '.', extensions: ['ts', 'tsx', 'js', 'jsx']},
    typecheck: {tsconfigs: ['tsconfig.json']},
    audit: {level: 'high', all: true},
    jscpd: {
      threshold: 5,
      minTokens: 50,
      paths: ['.'],
      pattern: '**/**.{js,jsx,ts,tsx}',
      ignore: [
        '**/node_modules/**',
        '**/android/**',
        '**/ios/**',
        '**/reports/code-audit',
      ],
    },
  },
};

export default config;
