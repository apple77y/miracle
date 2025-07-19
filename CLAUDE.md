# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS.

### Key Technologies
- **Framework**: Next.js 15.4.2 with App Router
- **Runtime**: React 19.1.0
- **Styling**: Tailwind CSS v4
- **TypeScript**: Enabled with strict mode
- **Fonts**: Geist and Geist Mono from Google Fonts
- **Build Tool**: Turbopack (Next.js's Rust-based bundler)

### Directory Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global Tailwind styles
- `public/` - Static assets (SVG icons)
- Path aliases: `@/*` maps to `./src/*`

### Configuration Files
- `next.config.ts` - Next.js configuration (minimal setup)
- `tsconfig.json` - TypeScript config with strict mode and Next.js plugin
- `eslint.config.mjs` - ESLint with Next.js and TypeScript rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind

### Development Notes
- Uses Geist fonts loaded via `next/font/google`
- Tailwind classes are utility-first with custom CSS variables
- No test framework is currently configured
- ESLint extends `next/core-web-vitals` and `next/typescript`