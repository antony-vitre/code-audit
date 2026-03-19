export interface LoggerOptions {
  verbose?: boolean;
  debug?: boolean;
}

export class Logger {
  private verbose: boolean;
  private debug: boolean;

  constructor(options?: LoggerOptions) {
    this.debug = options?.debug ?? false;
    this.verbose = this.debug || (options?.verbose ?? false);
  }

  info(...args: unknown[]) {
    console.log(...args);
  }

  verboseLog(...args: unknown[]) {
    if (this.verbose || this.debug) {
      console.log(...args);
    }
  }

  debugLog(...args: unknown[]) {
    if (this.debug) {
      console.log(...args);
    }
  }

  warn(...args: unknown[]) {
    console.warn(...args);
  }

  error(...args: unknown[]) {
    console.error(...args);
  }
}
