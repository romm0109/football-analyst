import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (/\.(ts|tsx|js|mjs|md|sql|json)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
}

walk(root);

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (text.endsWith("\n") === false) {
    throw new Error(`File must end with newline: ${path.relative(root, file)}`);
  }
}

console.log("PASS format:check");
