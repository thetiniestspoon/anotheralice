# Another Alice

An interactive story reading experience with narrative progression, atmospheric visuals, and AI-generated imagery.

## Overview

A pod-based reading interface where readers progress through chapters of "Another Alice" with system diagnostics, dome views, and image reveals. Tracks reader engagement through a "bloom level" mechanic. No backend required — all state persisted in localStorage.

## Tech Stack

- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS + shadcn/ui
- Data Fetching: TanStack Query
- Routing: React Router
- Persistence: localStorage (bloom level, chapter progress)

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Pod entry — story entry point |
| Chapter Reader | Main reading view with chapter text |
| Chapter Menu | Chapter navigation and selection |
| System Diagnostic | Pre-chapter atmospheric loading screens |
| Dome Viewer | Immersive reading environment |
| Image Reveal | AI-generated image gallery |

## Getting Started

```bash
npm install
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
