import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // фотографии кладём в public/, поэтому инлайнить в JS нечего
    assetsInlineLimit: 0,
  },
});
