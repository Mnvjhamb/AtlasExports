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
- Firebase project (for authentication and database)

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

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Enable **Firestore Database** (in test mode for development)
4. Enable **Authentication** and add Email/Password provider

### 2. Get Firebase Web Config (for Client)

1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" and click the web icon (`</>`)
3. Register your app and copy the config values

### 3. Get Firebase Admin SDK Credentials (for Server)

1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely (never commit this!)

### 4. Create Your First Admin User

1. In Firebase Console, go to Authentication > Users
2. Click "Add user" and create an admin account (email/password)
3. Copy the User UID
4. In Firestore, create a document in the `users` collection:
   - Document ID: The User UID from step 3
   - Fields:
     ```json
     {
       "email": "admin@theatlasexports.com",
       "displayName": "Admin",
       "role": "super_admin"
     }
     ```

## Environment Setup

### Client (`client/.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Server (`server/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

> **Note:** The `FIREBASE_PRIVATE_KEY` should be the entire private key from the service account JSON, with `\n` for line breaks.

## Running the Application

### Development Mode

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

### Production Build

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

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/categories` | Get all active categories |
| GET | `/api/categories/:id` | Get category by ID |
| GET | `/api/products` | Get all active products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/reviews` | Get approved reviews |
| POST | `/api/contact` | Submit contact form |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/categories` | Get all categories |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| GET | `/api/admin/products` | Get all products |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| GET | `/api/admin/reviews` | Get all reviews |
| POST | `/api/admin/reviews` | Create review |
| PUT | `/api/admin/reviews/:id` | Update review |
| DELETE | `/api/admin/reviews/:id` | Delete review |
| GET | `/api/admin/contacts` | Get all contacts |
| PUT | `/api/admin/contacts/:id/read` | Mark contact as read |
| DELETE | `/api/admin/contacts/:id` | Delete contact |

## Firestore Collections

| Collection | Description |
|------------|-------------|
| `users` | Admin users (linked to Firebase Auth) |
| `categories` | Product categories |
| `products` | Product listings |
| `reviews` | Customer reviews |
| `contacts` | Contact form submissions |
| `content` | Site content (hero text, etc.) |

## Tech Stack

### Client

- React 18
- TypeScript
- Vite
- Firebase SDK (Auth, Firestore)
- Tailwind CSS
- Shadcn/ui components
- React Query
- Wouter (routing)
- Framer Motion

### Server

- Express.js
- TypeScript
- Firebase Admin SDK
- Firestore
