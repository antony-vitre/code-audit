export interface AuditMeta {
  date: string;
  project: string;
  duration?: number;
  runId?: string;
}

export type Status = 'ok' | 'warn' | 'error' | 'skipped';

export interface PluginSection {
  enabled: boolean;
  status: Status;
  duration: number;
  report?: string | undefined;
  message?: string | undefined;
  summary?: Record<string, number>;
}

export interface AuditScores {
  eslint?: AuditScore;
  typecheck?: AuditScore;
  audit?: AuditScore;
  knip?: AuditScore;
  madge?: AuditScore;
  jscpd?: AuditScore;
  health?: AuditScore;
}

interface AuditScore {
  score: number;
  max: number;
}

export interface GlobalReport {
  version: number;
  meta: AuditMeta;
  summary: {status: Status};
  scores: AuditScores;
  tools: Record<string, PluginSection>;
}
