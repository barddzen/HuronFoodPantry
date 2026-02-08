---
name: push
description: Push commits and tags to both GitHub (origin) and YutzyNAS remotes. Use when the user says "push" or wants to sync remotes.
---

# Push to Dual Remotes

Push all commits and tags to both origin (GitHub) and YutzyNAS (Synology NAS backup).

## Remotes

- **origin** — `https://github.com/barddzen/HuronFoodPantry.git` (GitHub)
- **YutzyNAS** — `/Volumes/git/HuronFoodPantry.git` (Synology NAS, may be offline)

## Steps

1. Check for uncommitted changes with `git status -s`
   - If there are uncommitted changes, warn the user and ask if they want to commit first or push anyway
2. Push commits to origin:
   ```bash
   git push origin
   ```
3. Push commits to YutzyNAS:
   ```bash
   git push YutzyNAS
   ```
   - If YutzyNAS fails, report it as a warning (NAS may be offline) — don't treat as fatal
4. Push tags to both:
   ```bash
   git push origin --tags
   git push YutzyNAS --tags
   ```
5. Show result: `git log --oneline -3`

## Rules

- NEVER force push to main/master
- If YutzyNAS is unreachable, report it but don't fail — GitHub push is the critical one
- Always push tags to both remotes
