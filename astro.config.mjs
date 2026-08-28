// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://centrehold.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
