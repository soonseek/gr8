import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build', // Use 'build' instead of 'dist' to avoid Windows permission issues
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Web3 libraries (includes React Query to avoid circular deps)
          'web3-vendor': ['wagmi', 'viem', '@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
