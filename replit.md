# World of Warcraft Blog & Guides Website

## Overview
A WoW-themed blog and guides website built with React/Vite frontend and Express backend with Supabase integration for data persistence.

## Current State
- Full WoW-inspired design system with dark fantasy theme
- Complete frontend with Home, Article Detail, Category, and Admin pages
- Backend API with CRUD operations for articles and categories
- Rich text editor with TipTap for article content creation
- Category filtering and search functionality
- Dark/light mode support
- In-memory storage with sample data (Supabase tables need to be created)

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with WoW-themed design tokens
- **UI Components**: shadcn/ui
- **Rich Text**: TipTap editor
- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL) with in-memory fallback
- **State Management**: TanStack Query

## Project Structure
```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   │   ├── admin/     # Admin panel pages
│   │   └── ...        # Public pages
│   ├── lib/           # Utilities and helpers
│   └── hooks/         # Custom React hooks
server/
├── routes.ts          # API endpoints
├── storage.ts         # Data storage layer
└── index.ts           # Server entry point
shared/
└── schema.ts          # Shared types and schemas
```

## Setup Instructions

### Supabase Tables
To use Supabase for persistent storage, run the SQL from `supabase-schema.sql` in your Supabase dashboard's SQL editor. Without tables, the app uses in-memory storage with sample data.

### Environment Variables
Required secrets (already configured):
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SESSION_SECRET` - Session encryption key

Optional:
- `ADMIN_API_KEY` - Custom admin API key (default: "wow-admin-key-2024")

## API Endpoints

### Public Endpoints
- `GET /api/articles` - List all articles
- `GET /api/articles/:slug` - Get article by slug
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Get category by slug

### Admin Endpoints (require authentication in production)
- `POST /api/articles` - Create new article
- `PATCH /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/categories` - Create new category
- `GET /api/admin/status` - Check admin auth status

## Security Notes
- Admin endpoints are protected with API key middleware
- In development mode, admin access is allowed for testing
- For production, set `ADMIN_API_KEY` environment variable
- Consider implementing Supabase Auth for proper user authentication

## Recent Changes
- Added admin authentication middleware for protected routes
- Improved storage layer with Supabase table detection
- Added sample WoW-themed articles for demonstration
- Implemented category filtering and search functionality
- Created comprehensive design system following WoW aesthetic

## User Preferences
- WoW-themed dark fantasy design
- Uzbek language for UI text
- Rich text editing for article content
- Category-based article organization
