# gallery-asset-update

## When to use
- Adding or updating gallery images in `public/` or gallery components

## Goals
- Keep asset naming consistent and lightweight
- Ensure alt text is present and meaningful

## Workflow
1. Add images to `public/` with consistent, lowercase names.
2. Update gallery component data with correct paths.
3. Add or refine alt text (Korean primary).
4. Verify no image optimization features require server runtime.

## Files to check
- `public/**`
- `src/components/sections/Gallery*`
- `src/app/globals.css` (if styles adjusted)

## Output
- List of assets added/changed and alt text updates.
