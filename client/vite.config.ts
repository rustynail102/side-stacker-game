/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "127.0.0.1",
    port: 4000,
  },
  test: {
    environment: "happy-dom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
})
