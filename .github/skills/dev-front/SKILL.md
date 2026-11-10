---
name: dev-front
description: "Create, improve, refactor, analyze, and review React frontend code for The Daily Harvest project. Use for UI and component work."
---

# dev-front

Use this Skill for production frontend code in The Daily Harvest project. Keep the scope to the target component or files named in the request, primarily under `eCommApp/src/components`.

## Workflow

1. Inspect the target component and relevant neighboring components, routes, context, types, utilities, and styles before making changes.
2. Confirm the existing behavior and identify the smallest implementation that fulfills the request. Preserve current behavior unless the requested feature requires a change.
3. Implement UI logic in components and place shared state in the existing context or utility layers when appropriate. Use TypeScript and the project's existing React and Vite setup.
4. Follow existing React Router route patterns, `CartContext` usage, component conventions, and styling in `eCommApp/src/App.css`. Prefer existing helpers and patterns over new abstractions.
5. Consider applicable loading, error, empty, disabled, responsive, and accessibility states. Use semantic HTML, accessible names, and keyboard-friendly interactions.
6. Validate the change with the smallest relevant existing build or lint command. Report what changed, what was validated, and any remaining risk.

## Boundaries

- Support creating, improving, refactoring, analyzing, and reviewing production frontend code.
- Keep changes focused; do not make unrelated cleanup or behavior changes.
- Do not write, modify, or evaluate unit tests as part of this Skill. Testing work belongs to the `dev-qa` Skill.
