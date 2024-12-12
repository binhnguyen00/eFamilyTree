import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: path.resolve(__dirname),
    plugins: [
      react(), 
      tsconfigPaths()
    ],
    build: {
      outDir: path.resolve(__dirname, './dist'),              // this is default, dont have to add
      emptyOutDir: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern', // or "modern"
          includePaths: ["./src/css", "./src/css/theme"],
        }
      }
    },
    server: {
      port: 3000,
      open: true,
    },
  });
};
