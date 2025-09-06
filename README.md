# College Portal - Micro-Frontend Architecture

This project demonstrates a complete micro-frontend architecture with module federation, featuring:
- **Host App**: Main application that consumes remote components (port 5173)
- **Remote App**: Sub-module exposing UI components (port 5003)
- **Admin App**: Administrative interface with management tools (port 5004)
- **API Server**: REST API with MongoDB database (port 5001)

## Project Structure

```
├── api-server/        # Express.js API server with MongoDB (port 5001)
├── host-app/          # Main host application (port 5173)
├── remote-app/        # Remote UI components (port 5003)
├── admin-app/         # Admin management interface (port 5004)
├── start-apps.ps1     # PowerShell script to start all apps
├── start-apps.sh      # Shell script to start all apps (macOS/Linux)
└── README.md          # This file
```

## Features

- **Module Federation**: Remote app exposes components that are consumed by the host app
- **React + TypeScript**: Both apps use React with TypeScript
- **Material-UI**: Both apps include Material-UI for consistent styling
- **Vite**: Fast development server and build tool

## Exposed Components

The remote app exposes the following components:
- `Button`: A customizable button component
- `Card`: A simple card component

## Running the Applications

### Option 1: Using Shell Script (macOS/Linux)
```bash
./start-apps.sh
```

### Option 2: Using PowerShell (Windows)
```powershell
.\start-apps.ps1
```

### Option 3: Manual Start

1. Start the API server:
```bash
cd api-server
npm start
```

2. Start the remote app:
```bash
cd remote-app
npm run dev
```

3. Start the admin app:
```bash
cd admin-app
npm run dev
```

4. Start the host app:
```bash
cd host-app
npm run dev
```

## Accessing the Applications

- **Host App**: http://localhost:5173
- **Remote App**: http://localhost:5003
- **Admin App**: http://localhost:5004
- **API Server**: http://localhost:5001

## Development

Both applications include:
- Hot module replacement
- TypeScript support
- ESLint configuration
- Material-UI theming

## Module Federation Configuration

### Host App (`host-app/vite.config.ts`)
- Consumes remote components from `remoteApp` and `adminApp`
- Shares `react` and `react-dom`
- Runs on port 5173

### Remote App (`remote-app/vite.config.ts`)
- Exposes `Button` and `Card` components
- Shares `react` and `react-dom`
- Runs on port 5003

### Admin App (`admin-app/vite.config.ts`)
- Exposes `AdminDashboard`, `UserManagement`, and `MenuList` components
- Shares `react` and `react-dom`
- Runs on port 5004

### API Server (`api-server/server.js`)
- Provides REST API endpoints
- MongoDB database integration
- Runs on port 5001

## Building for Production

```bash
# Build remote app
cd remote-app
npm run build

# Build host app
cd host-app
npm run build
