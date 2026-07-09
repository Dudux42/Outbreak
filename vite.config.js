import { cpSync, existsSync, realpathSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyRuntimeAssets() {
  return {
    name: "copy-runtime-assets",
    closeBundle() {
      const source = resolve("assets");
      const target = resolve("dist/assets");
      if (!existsSync(source)) return;
      if (source === target || (existsSync(target) && realpathSync(source) === realpathSync(target))) {
        throw new Error("Refusing to copy runtime assets: source and target resolve to the same path.");
      }
      rmSync(target, { force: true, recursive: true });
      cpSync(source, target, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [copyRuntimeAssets()],
});
