# LegacyNotes

## Overview

LegacyNotes is a digital dead man's switch application that allows users to write private letters, notes, and instructions that are automatically delivered to designated recipients if the user becomes inactive. Users must periodically "check in" to confirm they are still active; if they fail to do so within their configured timeframe, their notes are released to recipients via email or SMS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based architecture with shared components. Path aliases (`@/` for client src, `@shared/` for shared code) simplify imports.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth (OpenID Connect based)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **API Pattern**: REST endpoints defined in shared route definitions with Zod schemas for type safety

The server uses a modular structure with Replit integrations separated into their own directory (`server/replit_integrations/`).

### Data Storage
- **Primary Database**: PostgreSQL (via Drizzle ORM)
- **Schema Location**: `shared/schema.ts` and `shared/models/auth.ts`
- **Key Tables**:
  - `users` - User accounts (required for Replit Auth)
  - `sessions` - Session storage (required for Replit Auth)
  - `notes` - User's legacy notes with recipient info and attachments
  - `userSettings` - Check-in frequency, release delay, and status tracking

### Authentication
- Uses Replit Auth (OpenID Connect flow)
- Session-based authentication stored in PostgreSQL
- Protected routes use `isAuthenticated` middleware
- User data synced from Replit identity provider on login

### File Uploads
- Object storage via Google Cloud Storage (Replit's sidecar integration)
- Presigned URL upload pattern (client requests URL, uploads directly to storage)
- Uppy library handles the upload UI and flow

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption
- `REPL_ID` - Replit environment identifier (auto-set by Replit)
- `ISSUER_URL` - OpenID Connect issuer (defaults to Replit)

### Optional External Services
- **Twilio** - SMS notifications for note delivery
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`

### Key NPM Dependencies
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `express` / `express-session` - Web server and sessions
- `passport` / `openid-client` - Authentication
- `@google-cloud/storage` - File storage
- `@tanstack/react-query` - Client-side data fetching
- `twilio` - SMS messaging
- `zod` - Schema validation (shared between client and server)