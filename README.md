# Christmas Gift List

A full-stack web application for managing Christmas gift ideas with a festive theme. Keep track of people and their gift ideas, and select the perfect gift for everyone on your list!

### ⚠️ DevOps vs. "Vibe-Code" : Les Corrections Nécessaires

L'application prototype de Jho contenait des problèmes de configuration qui empêchaient le déploiement en production. Pour que l'application fonctionne, les modifications suivantes (essentielles à la stratégie DevOps) ont été appliquées :

1.  **Correction CORS (Backend)** : Le Backend (Go) bloquait les requêtes provenant de l'URL Render du Frontend. L'adresse `https://oumaima-frontend.onrender.com` a été explicitement autorisée dans le fichier `backend/cmd/server/main.go`.
2.  **Correction de l'URL Codée en Dur (Frontend)** : Le Frontend utilisait l'adresse de développement locale (`http://localhost:8000`) codée en dur dans `frontend/src/api.ts`.
    * Ceci a été corrigé en remplaçant l'adresse locale par la variable d'environnement dynamique `import.meta.env.VITE_API_BASE_URL`.
3.  **Correction du Dockerfile (Frontend)** : Le `Dockerfile` du Frontend ne transmettait pas la variable d'environnement au moment du build (`npm run build`), causant une URL vide.
    * Le `Dockerfile` a été modifié pour injecter la variable `VITE_API_BASE_URL` au moment de la compilation.

Ces ajustements étaient nécessaires pour respecter le principe de **Configuration par Environnement** propre à une stratégie DevOps.

## About

This project is a demonstration of a modern full-stack application with:

- Frontend built with React 19, TypeScript, TanStack Router/Query, and Tailwind CSS
- Backend API built with Go using Chi router and PostgreSQL
- Component development environment with Storybook
- Unit testing with Vitest (frontend) and Go's testing framework (backend)
- End-to-end testing with Playwright

## Project Structure

```
2025-devops-tp-final/
├── frontend/           # React SPA with TanStack Router, Query & Form
├── backend/            # Go API with Chi router, pgx driver, and PostgreSQL
├── e2e/                # Playwright E2E tests
└── docs/               # Project documentation
```

### Packages Overview

- **[frontend](./frontend/README.md)**: React-based single-page application with TypeScript, component library (Storybook), and unit tests (Vitest)
- **[backend](./backend/README.md)**: RESTful API server with Go, database migrations, and data seeding utilities
- **[e2e](./e2e/README.md)**: End-to-end test suite using Playwright for user flow validation

Each package has its own detailed README with setup instructions, available commands, and best practices.

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Go** 1.23+
- **PostgreSQL** 15+ (or Docker for running PostgreSQL in a container)

### Installation

Install dependencies for all packages:

```bash
# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd backend && go mod download

# E2E test dependencies
cd e2e && npm install
```

For detailed setup instructions for each package, see:

- [Frontend Setup Guide](./frontend/README.md#getting-started)
- [Backend Setup Guide](./backend/README.md#getting-started)
- [E2E Testing Guide](./e2e/README.md#getting-started)

### Running the Application

1. **Start PostgreSQL database**
   Use docker or existing instance

2. **Start the backend server**

   ```bash
   cd backend
   go run cmd/server/main.go
   ```

   Server runs at http://localhost:8080. Migrations will run automatically on startup.

3. **Seed the database** (optional)

   ```bash
   cd backend
   go run scripts/seed.go
   ```

4. **Start the frontend dev server**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend runs at http://localhost:5173

   ## Déploiement en Production (CI/CD)

Ce projet est déployé sur **Render.com** en utilisant une approche de **Continuous Deployment (CD)** via **GitHub Actions** pour lier toutes les composantes.

### Architecture de Production

L'application est déployée en trois services interconnectés sur Render :
1.  **Base de Données (PostgreSQL)** : Service PostgreSQL managé.
2.  **Backend API (`oumaima-backend`)** : Service Web Go (construit par Docker). Il est configuré pour autoriser les requêtes CORS provenant du Frontend et reçoit la variable `DATABASE_URL` pour la connexion à la base de données.
3.  **Frontend SPA (`oumaima-frontend`)** : Service Web React/Vite (construit par Docker). Il reçoit la variable `VITE_API_BASE_URL` (`https://oumaima-backend.onrender.com`) pour communiquer avec l'API.

### Pipeline CI/CD

Chaque push sur la branche `main` déclenche un workflow **GitHub Actions** (`.github/workflows/ci-cd.yml`) qui effectue les étapes suivantes :
* Authentification auprès de **Docker Hub** et de **Render**.
* Construction et push de l'image Docker du **Backend**.
* Construction et push de l'image Docker du **Frontend**.
* Déclenchement automatique du déploiement des services `oumaima-backend` et `oumaima-frontend` sur Render.
* *NOTE : L'étape de création de GitHub Release est ajoutée dans le pipeline.*

### URL en Production

L'application est accessible à l'adresse publique :
👉 **[https://oumaima-frontend.onrender.com](https://oumaima-frontend.onrender.com)**

## Available Commands

Detailed command documentation is available in each package's README:

- [Frontend Commands](./frontend/README.md#available-commands)
- [Backend Commands](./backend/README.md#development)
- [E2E Commands](./e2e/README.md#available-commands)

### Quick Reference

### Frontend Commands

All frontend commands should be run from the `frontend/` directory:

```bash
cd frontend
```

#### Development

```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview production build locally
```

#### Testing

```bash
npm run test             # Run unit tests with Vitest
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Run tests with coverage report
```

#### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting with Prettier
```

#### Storybook

```bash
npm run storybook        # Start Storybook dev server (http://localhost:6006)
npm run build-storybook  # Build Storybook for production
```

### Backend Commands

All backend commands should be run from the `backend/` directory:

```bash
cd backend
```

#### Development

```bash
go run cmd/server/main.go              # Start the API server (http://localhost:8080)
go build -o bin/server cmd/server/main.go  # Build production binary
```

#### Testing

```bash
go test ./...                          # Run all tests
go test ./... -v                       # Run tests with verbose output
go test ./... -cover                   # Run tests with coverage
go test -run <TestName> ./...          # Run specific test
```

#### Code Quality

```bash
go vet ./...                          # Run Go vet (detect suspicious code)
go fmt ./...                          # Format Go code
```

#### Database

```bash
./scripts/migrate.sh                   # Run database migrations
go run scripts/seed.go                 # Seed database with sample data
```

### E2E Testing Commands

All E2E commands should be run from the `e2e/` directory:

```bash
cd e2e
```

```bash
npm test                # Run E2E tests in headless mode
npm run test:headed     # Run tests in headed mode (see browser)
npm run test:ui         # Run tests with Playwright UI
npm run report          # Show HTML test report
```

**Note**: Ensure both frontend and backend servers are running before executing E2E tests.

### Linting & Formatting (All Projects)

Run quality checks across the entire project:

```bash
# Frontend (from frontend/)
cd frontend
npm run lint
npm run format

# Backend (from backend/)
cd backend
go vet ./...
go fmt ./...
```

### Testing (All Projects)

Run all tests:

```bash
# Frontend unit tests
cd frontend && npm test

# Backend tests
cd backend && go test ./...

# E2E tests (requires running servers)
cd e2e && npm test
```

### Build (All Projects)

Build production artifacts:

```bash
# Frontend - outputs to frontend/dist/
cd frontend && npm run build

# Backend - outputs to backend/bin/server
cd backend && go build -o bin/server cmd/server/main.go
```

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory or set these environment variables:

- `DATABASE_URL` - PostgreSQL connection string
  - Default: `postgres://postgres:postgres@localhost:5432/christmas_gifts?sslmode=disable`
- `PORT` - Server port
  - Default: `8080`

### Frontend

Le Frontend utilise la variable d'environnement pour connaître l'adresse de l'API en production. Elle doit être injectée au moment du build (via le Dockerfile).

- `VITE_API_BASE_URL` - L'URL complète du service Backend en production.
  - Exemple: `https://oumaima-backend.onrender.com`

## Additional Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend setup, API proxy configuration, and deployment guide
- [Backend README](./backend/README.md) - Backend setup, API development, and database management
- [E2E Testing README](./e2e/README.md) - End-to-end testing guide with Playwright
- [API Documentation](./docs/api.md) - API endpoints and request/response formats
- [Database Schema](./docs/database.md) - Database structure and migrations
- [Reverse Proxy Architecture](./docs/reverse-proxy.md) - How the reverse proxy works in different deployment scenarios

---

Made with care for Christmas
