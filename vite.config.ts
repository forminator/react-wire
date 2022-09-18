/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

const external = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ outputDir: resolve(__dirname, './.cache/dts') })],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setup-test.ts',
    coverage: {
      reporter: ['clover', 'json', 'lcov', 'text'],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
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
