import fs from 'node:fs';
import path from 'node:path';
import defaultConfig from './defaultConfig.js';
import type {Config} from '../types/config.js';

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const deepMerge = <T>(target: T, source: Partial<T>): T => {
  const output = {...target} as any;
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = (target as any)[key];
    if (key !== 'knip' && isObject(sourceValue) && isObject(targetValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue;
    }
  }
  return output;
};

export const loadConfig = async (cwd: string): Promise<Config> => {
  const configPath = path.join(cwd, 'code-audit.config.json');
  let config = defaultConfig;
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const userConfig = JSON.parse(raw) as Partial<Config>;
    config = deepMerge(defaultConfig, userConfig);
  }
  return config;
};
