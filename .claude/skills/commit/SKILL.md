---
name: commit
description: Stage and commit changes with a message. Use when the user says "commit" or asks to save their work.
argument-hint: <commit message>
---

# Commit Changes

Commit all current changes to git with the provided message.

## Steps

1. Run `git status` to see what's changed (never use `-uall` flag)
2. Run `git diff --staged` and `git diff` to understand the changes
3. Run `git log --oneline -5` to see recent commit message style
4. If no `$ARGUMENTS` provided, draft a commit message based on the changes:
   - Summarize the nature (new feature, fix, refactor, etc.)
   - Focus on "why" not "what"
   - Keep it concise (1-2 sentences)
   - Ask the user to confirm the message before committing
5. Stage relevant files by name (prefer specific files over `git add .`)
   - NEVER commit `.env`, credentials, API keys, or secrets
   - Verify critical web files are included if modified: `*.html`, `*.css`, `*.js`
6. Create the commit:
   ```
   git commit -m "$(cat <<'EOF'
   <message>

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```
7. Show the result: `git log -1 --oneline` and `git status`

## Rules

- NEVER amend previous commits unless explicitly asked
- NEVER use `--no-verify` unless explicitly asked
- If pre-commit hook fails, fix the issue and create a NEW commit
- If there are no changes, say so — don't create empty commits
