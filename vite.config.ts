import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import path from 'path';

export default () => {
  return defineConfig({
    root: path.resolve(__dirname),
    plugins: [
      react(), 
      tsconfigPaths()
    ],
    build: {
      outDir: path.resolve(__dirname, './www'),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split vendor code into a separate chunk
            if (id.includes('node_modules')) {
              return 'vendor';
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
