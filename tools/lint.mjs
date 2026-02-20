import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "apps/api/src/modules/auth/auth.controller.ts",
  "apps/api/src/modules/auth/auth.service.ts",
  "apps/api/src/modules/auth/strategies/google.strategy.ts",
  "apps/api/src/modules/auth/guards/authenticated.guard.ts",
  "apps/web/src/features/auth/AuthGate.tsx",
  "apps/web/src/features/auth/LoginPage.tsx"
];

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${file}`);
  }
  const content = fs.readFileSync(fullPath, "utf8");
  if (content.includes("\t")) {
    throw new Error(`Tab indentation found in ${file}`);
  }
}

console.log("PASS lint");
