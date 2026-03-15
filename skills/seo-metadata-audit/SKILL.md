# seo-metadata-audit

## When to use
- Editing metadata, JSON-LD, sitemap, or SEO utilities

## Goals
- Ensure metadata matches real business info
- Keep structured data consistent with on-page content

## Workflow
1. Identify metadata source (`src/app/layout.tsx`, `src/utils/**`, `src/app/sitemap.ts`).
2. Verify business name, address, phone, URL match current data.
3. Confirm `ko`/`en` metadata align with page content.
4. If changing JSON-LD, verify required fields remain present.

## Files to check
- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- `src/utils/**`
- `public/**` (if referenced)

## Output
- Summary of metadata changes and consistency checks.
