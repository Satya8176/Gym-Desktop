import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: "./",   // ⭐ REQUIRED FOR ELECTRON

    // ⚠️ Dev server ONLY when running `npm run dev`
    server: command === "serve" ? {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: [".ngrok-free.app"],
      hmr: {
        protocol: "ws",
        port: 5173,
      },
    } : undefined,
  };
});
