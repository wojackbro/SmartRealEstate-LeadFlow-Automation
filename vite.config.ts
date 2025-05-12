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
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('react-router')) {
                return 'router';
              }
              if (id.includes('lucide-react')) {
                return 'ui';
              }
              if (id.includes('recharts')) {
                return 'charts';
              }
              if (id.includes('markdown') || id.includes('remark')) {
                return 'markdown';
              }
              if (id.includes('openai') || id.includes('vapi')) {
                return 'api';
              }
              return 'vendor';
            }
            if (id.includes('src/components')) {
              return 'components';
            }
            if (id.includes('src/pages')) {
              return 'pages';
            }
          }
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
