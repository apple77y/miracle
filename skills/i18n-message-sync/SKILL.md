# i18n-message-sync

## When to use
- Adding, removing, or changing i18n keys in `messages/*.json`

## Goals
- Keep `ko` and `en` keys in sync
- Avoid missing or unused keys

## Workflow
1. Locate the relevant key usage in components/pages.
2. Update `messages/ko.json` and `messages/en.json` together.
3. Check for missing keys by diffing key sets.
4. Ensure English remains concise and semantically aligned.

## Files to check
- `messages/ko.json`
- `messages/en.json`
- Key usage in `src/**`

## Output
- List of changed keys and confirmation of sync.
