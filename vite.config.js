import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyRuntimeAssets() {
  return {
    name: "copy-runtime-assets",
    closeBundle() {
      const source = resolve("assets");
      const target = resolve("dist/assets");
      if (!existsSync(source)) return;
      rmSync(target, { force: true, recursive: true });
      cpSync(source, target, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [copyRuntimeAssets()],
});
