# content-update-ko-en

## When to use
- Updating user-facing copy in `src/components/sections/**` or `src/app/**`
- Any change to primary Korean content that must stay semantically aligned in English

## Goals
- Keep tone calm, premium, trustworthy
- Preserve conversion-critical info: phone/email/CTA/map links
- Keep Korean primary; English concise and aligned

## Workflow
1. Identify the source of copy (component or `messages/*.json`).
2. Update Korean first, then align English meaning with shorter phrasing.
3. Verify contact CTA and location links remain visible and unchanged.
4. If layout or hierarchy changed, confirm mobile readability.

## Files to check
- `src/components/sections/**`
- `src/app/page.tsx`
- `messages/ko.json`
- `messages/en.json`

## Output
- Summary of copy changes and confirmation of contact/CTA visibility.
