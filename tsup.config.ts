import {defineConfig} from 'tsup';
import {cpSync, mkdirSync} from 'node:fs';
import path from 'node:path';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: true,
  bundle: false,
  outDir: 'dist',
  onSuccess: async () => {
    console.log('Build successful, copying dashboard assets...');
    const src = path.resolve('dashboard/dist');
    const dest = path.resolve('dist/assets');
    mkdirSync(dest, {recursive: true});
    cpSync(src, dest, {recursive: true});
  },
});
