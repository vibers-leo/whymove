import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'whymove',
  brand: {
    displayName: '지금 왜 떨어져?',
    primaryColor: '#3182F6',
    icon: 'https://vibers.co.kr/favicon.ico',
  },
  web: {
    host: 'localhost',
    port: 3421,
    commands: { dev: 'vite', build: 'vite build' },
  },
  permissions: [],
  webViewProps: { type: 'partner' },
});
