import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(srcPath)
      }
    },
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      open: true,
      cors: true
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: false
    },
    build: {
      target: "esnext",
      sourcemap: isProduction ? false : true,
      cssCodeSplit: true,
      minify: "esbuild",
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
      esbuildOptions: {
        target: "esnext"
      }
    }
  };
});
