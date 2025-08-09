# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build` (includes lint + type-check + next build)
- **Static export**: `npm run export` (builds and exports to static files)
- **Start production server**: `npm start`
- **Serve static build**: `npm run serve` (serves exported static files)
- **Lint code**: `npm run lint` / `npm run lint:fix`
- **Type checking**: `npm run type-check`
- **Testing**: `npm run test` / `npm run test:watch` / `npm run test:coverage`

## Project Architecture

This is a **Progressive Web App (PWA)** built with Next.js 15, featuring multilingual support, advanced SEO, and modern React patterns.

### Key Technologies
- **Framework**: Next.js 15.4.2 with App Router and static export
- **Runtime**: React 19.1.0 (latest stable)
- **PWA**: next-pwa with service worker and offline support
- **Styling**: Tailwind CSS v4 with custom design system
- **TypeScript**: Strict mode enabled with comprehensive type safety
- **Internationalization**: react-intl with Korean/English support
- **Analytics**: Vercel Analytics and Speed Insights
- **Testing**: Jest with React Testing Library
- **Build Tool**: Turbopack for development, standard Webpack for production
- **Deployment**: Static export optimized for CDN/edge deployment

### Directory Structure
```
src/
├── app/                    # App Router pages and API routes
│   ├── api/               # API routes (map-proxy, naver-map)
│   ├── guide/             # Flower care guide page
│   ├── occasion/          # Event occasion guide page  
│   ├── offline/           # PWA offline fallback page
│   ├── layout.tsx         # Root layout with PWA, i18n, analytics
│   ├── page.tsx           # Home page
│   ├── sitemap.ts         # Dynamic sitemap generation
│   └── globals.css        # Global styles with custom CSS variables
├── components/
│   ├── layout/            # Layout components (Header, Footer)
│   ├── sections/          # Page sections (Hero, Services, About, Gallery, Contact)
│   ├── ui/                # Reusable UI components with PWA features
│   ├── I18nProvider.tsx   # Internationalization context
│   ├── DynamicLayout.tsx  # Dynamic metadata and JSON-LD management
│   ├── PWALayout.tsx      # PWA-specific layout wrapper
│   └── __tests__/         # Comprehensive component tests
├── hooks/                 # Custom React hooks for PWA features
├── utils/                 # Utility functions (metadata, SEO)
└── messages/             # i18n message files (ko.json, en.json)
```

### Key Features

#### Progressive Web App (PWA)
- **Service Worker**: Automatic registration with offline support
- **Caching Strategy**: NetworkFirst for APIs, CacheFirst for static assets
- **Offline Page**: Dedicated offline experience at `/offline`
- **Background Sync**: Automatic data synchronization when online
- **Push Notifications**: User engagement features
- **Install Prompts**: Native app-like installation

#### Internationalization (i18n)
- **Languages**: Korean (default) and English
- **Dynamic Switching**: Client-side language switching with persistence
- **SEO Optimization**: Language-specific metadata and structured data
- **Message Management**: JSON-based message files in `/messages/`

#### Advanced SEO & Metadata
- **Structured Data**: JSON-LD for business, products, and local SEO
- **Dynamic Metadata**: Language-specific titles, descriptions, Open Graph
- **Sitemap**: Auto-generated with proper priority and change frequency
- **Meta Tags**: Comprehensive social media and search engine optimization

#### Modern Development Practices
- **TypeScript**: Strict typing throughout the application
- **Testing**: Jest with React Testing Library for component testing
- **Code Quality**: ESLint + Prettier with Husky pre-commit hooks
- **Performance**: Optimized images, lazy loading, and caching strategies

### Configuration Files
- `next.config.ts` - Next.js + PWA configuration with static export
- `tsconfig.json` - Strict TypeScript configuration
- `eslint.config.mjs` - ESLint rules for Next.js and TypeScript
- `package.json` - Dependencies and scripts with lint-staged setup

### Development Notes
- **Static Export**: Configured for CDN deployment (Vercel, Netlify, etc.)
- **Turbopack**: Used in development for faster builds
- **Image Optimization**: Disabled for static export compatibility
- **Path Aliases**: `@/*` maps to `./src/*`
- **PWA Testing**: Use `npm run serve` to test PWA features locally
- **i18n Testing**: Test both Korean and English language variants
- **Offline Testing**: Disable network in DevTools to test offline functionality

### API Integrations
- **Naver Maps**: Static map integration with language support
- **Map Proxy**: Server-side proxy for external map services
- **External APIs**: Cached with service worker for offline availability