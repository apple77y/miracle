# build-verify

## When to use
- Before finishing any functional change or refactor

## Goals
- Keep CI green (lint, type-check, test, build)

## Workflow
1. Run `npm run lint` if code changed.
2. Run `npm run test` for behavior changes.
3. Run `npm run build` for release readiness.
4. Summarize results and failures clearly.

## Output
- Commands run and status summary.
