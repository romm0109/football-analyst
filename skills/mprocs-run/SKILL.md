---
name: mprocs-run
description: Run and operate mprocs for local development workflows. Use when Codex needs to launch multiple agents or processes in parallel in one terminal UI, especially without creating `mprocs.yaml`, and when it needs install steps, inline command patterns, `--npm`/`--procfile` usage, or troubleshooting.
---

# Mprocs Run

Run mprocs quickly and default to no-YAML inline commands unless the user asks for persistent config.

## Quick Start

1. Launch parallel commands directly:
   - `mprocs "cmd1" "cmd2" "cmd3"`
2. For parallel agents, pass one agent command per quoted argument:
   - `mprocs "codex --task 'agent 1'" "codex --task 'agent 2'" "codex --task 'agent 3'"`
3. Use basic controls:
   - `j`/`k` to move between processes.
   - `C-a` to toggle focus between process list and output.
   - `r` to restart selected process.
   - `q` to quit.

## Parallel Agents Without YAML

Use this as the default execution pattern when the user asks to run multiple agents:

```bash
mprocs "agent-command-1" "agent-command-2" "agent-command-3"
```

Windows PowerShell example:

```powershell
mprocs "codex --task 'implement backend api'" "codex --task 'build ui flow'" "codex --task 'write e2e tests'"
```

Guidance:
- Keep each agent command in its own quoted argument.
- Avoid nested quote issues by using single quotes inside each command when possible.
- If a command itself needs complex quoting, move it to a script and call the script from mprocs.

## Install Mprocs

Choose one platform-appropriate installer:
- `brew install mprocs`
- `cargo install mprocs`
- `scoop install mprocs`
- `npm install -g mprocs`
- Download binary from GitHub releases and add it to `PATH`.

Verify installation with:
- `mprocs --version`

## Create `mprocs.yaml`

Use this baseline:

```yaml
procs:
  server:
    shell: "npm run dev:server"
  client:
    shell: "npm run dev:client"
  tests:
    shell: "npm run test -- --watch"
    autostart: false
```

Prefer `shell` for concise commands and `cmd` array when shell parsing causes issues.

Useful fields:
- `cwd`: set process working directory.
- `env`: set per-process environment variables.
- `autostart`: disable startup for optional processes.
- `autorestart`: restart after exit.
- `log_dir`: store per-process logs.
- `stop`: customize termination behavior.

## Alternative Inputs

- Use package scripts:
  - `mprocs --npm`
- Use Procfile:
  - `mprocs --procfile ./Procfile.dev`
- Use explicit config path:
  - `mprocs --config ./path/to/mprocs.yaml`

## Troubleshooting

- If `mprocs` command is missing, check `PATH` and rerun install.
- If config fails to load, validate YAML indentation and that each process has exactly one of `shell` or `cmd`.
- If process exits immediately with `autorestart`, note that very fast failures are not restarted.
- On Windows, prefer `scoop` or npm global install when binary path setup is inconsistent.

## Decision Rules

- If the user asks to run multiple agents in parallel, use inline CLI form `mprocs "cmd1" "cmd2" ...` and do not create YAML.
- If the user asks for a quick temporary run, use inline CLI form `mprocs "cmd1" "cmd2"`.
- If the user asks for persistent/reusable process definitions, then create or update `mprocs.yaml`.
- If the user asks to reuse npm scripts, use `--npm`.
- If the user already has a Procfile, prefer `--procfile`.

## Reference

Read `references/mprocs-official-notes.md` for command examples and config details sourced from the upstream project.
