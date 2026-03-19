export interface ExecResult {
  ok: boolean;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  all: string;
  notFound: boolean;
}
