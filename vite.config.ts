import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  if (mode === 'demo') return { base: './', cacheDir: '.vite' };
  return {
    build: {
      lib: { entry: 'src/main.ts', formats: ['es'], fileName: 'main' },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['test/**/*-test.{ts,tsx}'],
      setupFiles: ['test/testHelpers/requireSources.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/js/**/*.{ts,tsx}'],
        reporter: ['text', 'lcov'],
      },
    },
  };
});
