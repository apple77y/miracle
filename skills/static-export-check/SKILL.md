# static-export-check

## When to use
- Adding routes, images, dynamic data, or external integrations

## Goals
- Preserve static export compatibility
- Avoid runtime-only features

## Workflow
1. Check `next.config.ts` for `output: 'export'` constraints.
2. Ensure no server-only APIs are introduced in App Router pages.
3. Verify images use static-friendly settings (`images.unoptimized`).
4. Confirm all routes are statically resolvable.

## Files to check
- `next.config.ts`
- `src/app/**`
- `src/components/**`

## Output
- Any static export risks and mitigations.
