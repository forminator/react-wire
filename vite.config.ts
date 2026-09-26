/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'unplugin-dts/vite';
import packageJson from './package.json' with { type: 'json' };

const dependencies = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
];

const external = (source: string) =>
  dependencies.some(
    (dependency) =>
      source === dependency || source.startsWith(dependency + '/'),
  );

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({ bundleTypes: true, strictOutput: false }), react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setup-test.ts',
    coverage: {
      reporter: ['clover', 'json', 'lcov', 'text'],
      provider: 'istanbul',
    },
  },
  build: {
    lib: {
      entry: [resolve(import.meta.dirname, 'src/index.ts')],
      formats: ['es'],
    },
    rollupOptions: {
      external,
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
