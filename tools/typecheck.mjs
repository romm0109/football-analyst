import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredTypeFiles = [
  "apps/api/src/config/auth.config.ts",
  "apps/api/src/modules/auth/auth.module.ts",
  "apps/web/src/types/auth.ts"
];

for (const file of requiredTypeFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing type-bearing file: ${file}`);
  }
  const content = fs.readFileSync(fullPath, "utf8");
  const hasTypeMarkers = content.includes("interface ") || content.includes("type ");
  if (!hasTypeMarkers) {
    throw new Error(`Type declarations missing in ${file}`);
  }
}

console.log("PASS typecheck");
