# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Context

- **Service**: Miracle Flower studio website
- **Production URL**: `https://miracle-flower.vercel.app`
- **Primary purpose**: convert visitors into 상담/주문 문의 through clear trust signals and contact paths
- **Primary audience**: local customers in Bundang/Seongnam on mobile-first browsing

## Non-Technical Priorities

- Keep brand tone calm, premium, and trustworthy (avoid aggressive marketing copy).
- Preserve business-critical information visibility:
  - phone/email
  - location/map links
  - opening/consultation guidance
- When editing copy, prioritize conversion clarity over stylistic novelty.
- Korean content is primary; English content should remain semantically aligned and concise.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build`
- **Static export**: `npm run export` (builds and exports to static files)
- **Start production server**: `npm start`
- **Serve static build**: `npm run serve` (serves exported static files)
- **Lint code**: `npm run lint` / `npm run lint:fix`
- **Type generation**: `npm run typegen`
- **Type checking**: `npm run type-check`
- **Testing**: `npm run test` / `npm run test:watch` / `npm run test:coverage`

## Project Architecture

This project is a **static-exported Next.js 16 App Router** website for Miracle Flower.

### Key Technologies
- **Framework**: Next.js 16.x with App Router and static export (`output: 'export'`)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4 with custom design system
- **TypeScript**: Strict mode enabled with comprehensive type safety
- **Internationalization**: react-intl with Korean/English support
- **Analytics**: Vercel Analytics and Speed Insights
- **Testing**: Jest with React Testing Library
- **Build Tool**: Turbopack enabled for development
- **Deployment**: Vercel static-oriented deployment flow

### Directory Structure
```
src/
├── app/                    # App Router pages
│   ├── guide/             # Flower care guide page
│   ├── occasion/          # Event occasion guide page  
│   ├── offline/           # Offline fallback page
│   ├── layout.tsx         # Root layout (metadata, resource hints, analytics)
│   ├── page.tsx           # Home page
│   ├── sitemap.ts         # Sitemap generation
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components (Header, Footer)
│   ├── sections/          # Home sections (Hero, Services, About, Gallery, Contact)
│   ├── ui/                # Reusable UI components
│   ├── I18nProvider.tsx   # Internationalization context
│   ├── DynamicLayout.tsx  # Dynamic metadata and JSON-LD management
│   ├── ResourceHints.tsx  # prefetchDNS/preconnect/preload hints
│   └── __tests__/         # Comprehensive component tests
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions (metadata, SEO)
messages/                  # i18n message files (ko/en)
```

### Key Features

#### Internationalization (i18n)
- **Languages**: Korean (default) and English
- **Dynamic Switching**: Client-side language switching with persistence
- **SEO Optimization**: Language-specific metadata and structured data
- **Message Management**: JSON-based message files in `messages/`

#### Advanced SEO & Metadata
- **Structured Data**: JSON-LD for business, products, and local SEO
- **Dynamic Metadata**: Language-specific titles, descriptions, Open Graph
- **Sitemap**: Static-compatible sitemap with priorities/change-frequency
- **Meta Tags**: Comprehensive social media and search engine optimization

#### Modern Development Practices
- **TypeScript**: Strict typing throughout the application
- **Testing**: Jest with React Testing Library for component testing
- **Code Quality**: ESLint + Husky + lint-staged
- **CI checks**: lint / type-check / test via GitHub Actions

### Configuration Files
- `next.config.ts` - Next.js static export config (`typedRoutes`, `images.unoptimized`)
- `tsconfig.json` - Strict TypeScript configuration
- `eslint.config.mjs` - ESLint rules for Next.js and TypeScript
- `package.json` - Dependencies and scripts
- `.github/workflows/ci-checks.yml` - CI pipeline + Vercel check notifications

### Development Notes
- **Static Export**: Configured for CDN deployment (Vercel, Netlify, etc.)
- **Turbopack**: Enabled in development
- **Image Optimization**: Disabled for static export compatibility
- **Typed Routes**: Enabled via `next.config.ts` + `next typegen`
- **Path Aliases**: `@/*` maps to `./src/*`
- **i18n Testing**: Test both Korean and English language variants
- **Offline Testing**: Disable network in DevTools to verify `/offline`

## Content Change Guardrails

- Do not remove or hide core conversion UI (contact CTA, map links, 상담 버튼) without explicit request.
- If layout changes are made, verify mobile readability first.
- Keep SEO/business metadata consistent with actual store information.
