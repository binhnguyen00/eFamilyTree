import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import path from 'path';

export default () => {
  return defineConfig({
    root: path.resolve(__dirname),
    plugins: [
      react(), 
      zaloMiniApp(),
      tsconfigPaths()
    ],
    build: {
      outDir: path.resolve(__dirname, './www'),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) { // split into chunks
            if (id.includes('www')) {
              return 'vendor';
            }
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) {
                return 'react-dom';
              }
              if (id.includes('react-router-dom')) {
                return 'react-router-dom';
              }
              if (id.includes('react')) {
                return 'react';
              }
              if (id.includes('zmp')) {
                return 'zmp';
              }
              if (id.includes('components')) {
                return 'components';
              }
              if (id.includes('hooks')) {
                return 'hooks';
              }
              if (id.includes('pages')) {
                return 'pages';
              }
            }
          },
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern', // or "modern"
          includePaths: [
            "./src/css", 
            "./src/css/theme", 
            "./src/css/font"
          ],
        }
      }
    },
    server: {
      port: 2999,
      open: true,
    },
  });
};
