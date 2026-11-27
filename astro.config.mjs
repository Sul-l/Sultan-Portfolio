// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Run the dev server on 127.0.0.1 so every browser connects (Firefox can fail on "localhost").
  server: { host: '127.0.0.1' },

  // Your live domain. It is used for canonical URLs and social previews.
  site: 'https://sulsart.com',
});
