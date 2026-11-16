import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // relative paths, so the site works at any address
  build: { target: 'es2022' },
});
