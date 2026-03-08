import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./packages/shared/src', import.meta.url)),
      '@mall-user': fileURLToPath(new URL('./apps/mall-user/src', import.meta.url)),
      '@mall-admin': fileURLToPath(new URL('./apps/mall-admin/src', import.meta.url))
    }
  }
});
