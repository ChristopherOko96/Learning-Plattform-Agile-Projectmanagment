---

Agent Usage:
- Für UI, HTML, CSS, JavaScript und Webseiten-Features verwende bevorzugt den Agenten `web-app-builder`.
- Für Bugfixes, Fehlersuche, Code Reviews und Sicherheitsprüfungen verwende bevorzugt den Agenten `code-review-debugger`.
- Bevor Code geändert wird, immer einen kurzen Plan erstellen.
- Nach Änderungen immer betroffene Dateien und Grund der Änderung nennen.


---

---

# Master Behavior Rules

## Priority 1: Plan before code

Before modifying code:
- Create a 6–10 step plan.
- List files that may be changed.
- Mention risks.
- Do not edit unrelated files.

## Priority 2: Minimal changes

- Change only what is necessary.
- Avoid drive-by refactoring.
- Do not rename files, functions or variables unless needed.
- Do not introduce new dependencies without approval.

## Priority 3: Context and token discipline

- Use Grep/Glob before reading many files.
- Read only relevant files.
- Avoid loading large unrelated files.
- Summarize progress after larger changes.
- Use /compact after completed milestones or when context becomes large.

## Priority 4: Safe execution

- Ask before running destructive commands.
- Do not delete files without explicit approval.
- Do not expose secrets.
- Do not modify config/security files unless the task requires it.

## Priority 5: Output format

After implementation, always respond with:
1. Summary
2. Changed files
3. What was fixed/added
4. How to test
5. Next recommended step

