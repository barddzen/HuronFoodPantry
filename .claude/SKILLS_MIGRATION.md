# Skills Migration — TODO

**TODO** (2026-07-01): Shared skills were promoted to global `~/.claude/skills/`. The local copies below are now duplicates that shadow the global versions.

## Safe to delete now (global versions are drop-in)
- `.claude/skills/commit` → global `commit`
- `.claude/skills/push` → global `push` (remote-agnostic)

Both are clean drop-ins — delete the two local copies and this repo uses the globals. No manifest needed (this repo has no `done`/`update-docs`).
