# mprocs Official Notes

Source: upstream repository documentation at https://github.com/pvolok/mprocs

## Installation Options

- Homebrew: `brew install mprocs`
- Cargo: `cargo install mprocs`
- Scoop: `scoop install mprocs`
- npm: `npm install -g mprocs`
- Binary releases are available from GitHub Releases.

## Run Modes

- No config, one-off commands:
  - `mprocs "python -m http.server" "npm run dev"`
- Use local config:
  - `mprocs`
- Import npm scripts:
  - `mprocs --npm`
- Use a Procfile:
  - `mprocs --procfile ./Procfile`
- Use specific config:
  - `mprocs --config ./mprocs.yaml`

## `mprocs.yaml` Shape

Top-level key is `procs:`. Each process can include:

- `shell` or `cmd` (define command)
- `cwd`
- `env`
- `autostart`
- `autorestart`
- `stop`
- `log_dir`

## Keyboard Controls (Common)

- `j` / `k` navigate processes
- `C-a` toggle process list vs output focus
- `r` restart selected process
- `q` quit

## Behavior Notes

- Each process should define exactly one of `shell` or `cmd`.
- `autorestart` skips restart when process exits too quickly.
