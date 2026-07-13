import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const legacyStaticEntries = [
  "updates",
  "products",
  "case-studies",
  "research",
  "assets",
  "dashboard.html",
  "dashboard-data.json",
];

function copyLegacyStatic() {
  return {
    name: "copy-legacy-static",
    apply: "build" as const,
    closeBundle() {
      const outputDir = resolve(__dirname, "dist");

      for (const entry of legacyStaticEntries) {
        const source = resolve(__dirname, entry);

        if (existsSync(source)) {
          cpSync(source, resolve(outputDir, entry), { recursive: true });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyLegacyStatic()],
});
