---
name: dev-qa
description: Create, review, analyze, and improve focused unit tests for React components in this project.
---

# dev-qa

Use this Skill for unit tests in the Daily Harvest app. Work only on tests; do not implement production features.

## Conventions

- Use Vitest, React Testing Library, `user-event`, and the project's jsdom setup in `eCommApp/src/test/setup.ts`.
- Follow existing tests, especially `eCommApp/src/components/CartPage.test.tsx`.
- Keep tests focused, deterministic, isolated from real external I/O, and scoped to the target file or component in the request.
- Give each test a clear, descriptive name that states the behavior and expected outcome.
- Test one behavior per test. Prefer one focused assertion when it adequately verifies the outcome; use multiple assertions when they jointly verify that same behavior.
- Structure every test with Arrange, Act, and Assert phases, marked with a brief comment in each phase.
- Use accessible queries such as roles and accessible names. Prefer queries that describe what a user sees or does over implementation details.
- Set up small, valid, representative test data close to the test. Use a factory or shared fixture only when it improves clarity and avoid mutating shared data.
- Cover relevant happy paths, empty/loading/error states, disabled controls, and user interactions.
- Mock or stub network requests, context providers, and child components only when needed to isolate the behavior; restore stubs and mocks between tests.
- Test error handling by triggering realistic failures and asserting the intended observable result or error contract. Do not swallow unexpected errors or hide failing diagnostics with broad catches or unnecessary console suppression.
- Keep failure messages useful through specific test names, precise expected values, and semantic queries. Add a custom assertion message only when it clarifies context that the matcher cannot provide.
- Keep tests fast: avoid real I/O, arbitrary sleeps, redundant renders, and unnecessary broad mocks. Use `findBy*` or `waitFor` only for genuinely asynchronous behavior.
- Prefer a simple, maintainable test structure. Extract render helpers only for repeated setup, and keep each test's important inputs and behavior easy to see.
- Run the focused test file or `npm run test:run` from `eCommApp` after changing tests.

## Example reference

Before creating or revising tests, consult [the example unit tests](./examples/example-tests.md) for the project's conventions. Adapt their patterns to the target behavior; do not copy them as a full test suite.
