import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'joyShared',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'cjs' ? 'index.js' : 'joy-shared.mjs',
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  plugins: [dts()],
});
