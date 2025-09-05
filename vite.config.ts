import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import ViteRestart from 'vite-plugin-restart';
import path from 'path';

export default defineConfig({
  plugins: [
    ViteRestart({
      restart: [
        '../frontend-top-users/**/*',
        '../frontend-top-finance/**/*',
      ],
    }),
    federation({
      name: 'mainFront',
      remotes: {
        topUsers: {
          type: 'module',
          name: 'topUsers',
          entry: 'http://localhost:3001/assets/remoteEntry.js',
          entryGlobalName: 'topUsers',
          shareScope: 'default',
        },
        topFinance: {
          type: 'module',
          name: 'topFinance',
          entry: 'http://localhost:3002/assets/remoteEntry.js',
          entryGlobalName: 'topFinance',
          shareScope: 'default',
        },
      },
      exposes: {
        './UserStore': './src/store/userStore.ts',
      },
      filename: 'assets/remoteEntry.js',
      shared: ['react', 'react-dom', 'zustand'],
    }),
    react(),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
