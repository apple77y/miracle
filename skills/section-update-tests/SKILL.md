# section-update-tests

## When to use
- Any UI/content behavior change in `src/components/sections/**` or `src/app/page.tsx`

## Goals
- Add or update tests to cover visible behavior
- Keep tests minimal but meaningful

## Workflow
1. Identify impacted section component and behavior.
2. Update or add tests in `src/components/__tests__/`.
3. Prefer role/text queries to verify user-visible content.
4. If adding new strings, verify i18n variants if applicable.

## Files to check
- `src/components/sections/**`
- `src/components/__tests__/**`
- `messages/ko.json`
- `messages/en.json`

## Output
- Test changes summary and whether tests were run.
