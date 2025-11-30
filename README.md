# Atlas Exports

A full-stack web application for The Atlas Exports - a B2B export company.

## Project Structure

```
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express.js backend (TypeScript)
├── attached_assets/ # Static assets (images, etc.)
└── package.json     # Root workspace scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

Install all dependencies for both client and server:

```bash
npm run install:all
```

Or install separately:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Setup

#### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/atlas_exports
SESSION_SECRET=your-super-secret-session-key
CORS_ORIGIN=http://localhost:3000
```

#### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

Run both client and server concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Server (port 5000)
cd server && npm run dev

# Terminal 2 - Client (port 3000)
cd client && npm run dev
```

#### Production Build

```bash
# Build both
npm run build

# Or build separately
npm run build:server
npm run build:client
```

## Ports

| Service          | Port |
| ---------------- | ---- |
| Client (Vite)    | 3000 |
| Server (Express) | 5000 |

## API Endpoints

All API routes are prefixed with `/api`.

- `GET /health` - Health check endpoint

## Tech Stack

### Client

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components
- React Query
- Wouter (routing)
- Framer Motion

### Server

- Express.js
- TypeScript
- Drizzle ORM
- PostgreSQL (via Neon)
- Passport.js (authentication)
