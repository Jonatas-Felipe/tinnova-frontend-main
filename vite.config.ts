import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import federationPlugin from '@originjs/vite-plugin-federation';
import ViteRestart from 'vite-plugin-restart';
import path from 'path';

const isTest = process.env.VITEST;

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    ViteRestart({
      restart: [
        '../frontend-top-users/**/*',
        '../frontend-top-finance/**/*',
      ],
    }),
    !isTest && (mode === 'development' ? federation({
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
    }) : federationPlugin({
      name: 'mainFront',
      filename: 'assets/remoteEntry.js',
      exposes: {
        './UserStore': './src/store/userStore.ts',
      },
      remotes: {
        topUsers: 'http://localhost:3001/assets/remoteEntry.js',
        topFinance: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'zustand'],
    })),
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [
      'node_modules/**',
      'dist/**',
      '**/*.config.{js,ts}',
    ],
  },
}));
