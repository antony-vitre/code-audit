import type {GlobalReport, Status} from '../types/report.js';

const MAX = {
  eslint: 20,
  typecheck: 20,
  audit: 20,
  knip: 15,
  madge: 15,
  jscpd: 10,
  health: 100,
} as const;

const clamp = (n: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, n));
};

const getScore = (max: number, scoreLossByTool: number): number => {
  const score = max - scoreLossByTool;
  return clamp(score, 0, max);
};

export const computeScores = (report: GlobalReport): GlobalReport => {
  const {tools} = report || {};
  const {eslint, typecheck, audit, knip, madge, jscpd} = tools || {};

  // Lint issues
  const lintErr = eslint?.summary?.errors ?? 0;
  const lintWarn = eslint?.summary?.warnings ?? 0;
  const lintScore = getScore(MAX.eslint, lintErr * 2 + lintWarn * 0.5);
  // Type errors
  const typeErr = typecheck?.summary?.errors ?? 0;
  const typeScore = getScore(MAX.typecheck, typeErr * 5);
  // Vulnerabilities
  const auditErr = audit?.summary?.errors ?? 0;
  const auditWarn = audit?.summary?.warnings ?? 0;
  const auditScore = getScore(MAX.audit, auditErr * 5 + auditWarn * 2);
  // Unused code
  const unusedErr = knip?.summary?.errors ?? 0;
  const unusedWarn = knip?.summary?.warnings ?? 0;
  const unusedScore = getScore(MAX.knip, unusedErr * 5 + unusedWarn * 2);
  // Circular dependencies
  const circularDeps = madge?.summary?.circularDeps ?? 0;
  const circularDepsScore = getScore(MAX.madge, circularDeps * 5);
  // Code duplication
  const dupCodes = jscpd?.summary?.duplicationCodes ?? 0;
  const dupCodesScore = getScore(MAX.jscpd, dupCodes * 2);
  // Health (Global score)
  const healthScore =
    lintScore +
    typeScore +
    auditScore +
    unusedScore +
    circularDepsScore +
    dupCodesScore;

  report.scores = {
    eslint: {score: lintScore, max: MAX.eslint},
    typecheck: {score: typeScore, max: MAX.typecheck},
    audit: {score: auditScore, max: MAX.audit},
    knip: {score: unusedScore, max: MAX.knip},
    madge: {score: circularDepsScore, max: MAX.madge},
    jscpd: {score: dupCodesScore, max: MAX.jscpd},
    health: {score: clamp(healthScore, 0, 100), max: MAX.health},
  };

  // Global status
  const statuses: Status[] = Object.values(tools).map((t) => t.status);
  const status: Status = statuses.includes('error')
    ? 'error'
    : statuses.includes('warn')
      ? 'warn'
      : 'ok';

  report.summary.status = status;

  return report;
};
