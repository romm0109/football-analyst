import { spawn } from "node:child_process";

const npmExecPath = process.env.npm_execpath;

function run(scriptName) {
  if (!npmExecPath) {
    throw new Error("npm_execpath is not available in this process.");
  }
  return spawn(process.execPath, [npmExecPath, "run", scriptName], {
    stdio: "inherit",
    shell: false
  });
}

const api = run("dev:api");
const web = run("dev:web");

function shutdown() {
  api.kill("SIGINT");
  web.kill("SIGINT");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

api.on("exit", (code) => {
  if (code && code !== 0) {
    process.exit(code);
  }
});

web.on("exit", (code) => {
  if (code && code !== 0) {
    process.exit(code);
  }
});
