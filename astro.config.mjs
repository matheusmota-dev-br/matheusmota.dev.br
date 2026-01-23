import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://matheusmota.dev.br',
  devToolbar: {
    enabled: false,
  },
  integrations: [tailwind(), icon(), mdx(), react()],
  optimizeDeps: {
    include: ['react-compiler-runtime']
  }
});