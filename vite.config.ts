import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return { base: './', cacheDir: '.vite' };
  }
  const palettes = new URL('./src/js/themes/base16/palettes/', import.meta.url);
  const paletteEntries = Object.fromEntries(
    readdirSync(palettes)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => [
        `themes/${file.slice(0, -3)}`,
        fileURLToPath(new URL(file, palettes)),
      ])
  );
  return {
    build: {
      lib: {
        entry: {
          main: 'src/main.ts',
          themes: 'src/themes.ts',
          ...paletteEntries,
        },
        formats: ['es'],
        fileName: (_format, name) => `${name}.js`,
      },
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
      css: { include: [/\/src\/style\/global\.css(?:\?inline)?$/] },
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
