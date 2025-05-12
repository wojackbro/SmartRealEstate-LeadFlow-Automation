import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Vite config - Environment variables loaded:', {
    hasVapiKey: !!env.VITE_VAPI_KEY,
    hasAssistantId: !!env.VITE_VAPI_ASSISTANT_ID,
    mode
  });

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom', 'react-router-dom']
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            'ui': ['lucide-react'],
            'charts': ['recharts'],
            'markdown': ['react-markdown', 'remark-gfm'],
            'api': ['openai', '@vapi-ai/web'],
            'utils': ['uuid', 'ws', 'node-fetch']
          },
        },
      },
      sourcemap: mode === 'development',
      minify: mode === 'production',
      target: 'esnext',
      assetsInlineLimit: 4096
    },
    define: {
      'process.env': env
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    preview: {
      port: 3000,
      strictPort: true,
      host: true
    }
  };
});
