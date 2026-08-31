# Vehicle Marketplace - System Architecture

This system utilizes a highly decoupled, modular **Clean Architecture** approach. This guarantees that business logic (Use Cases/Domain) is independent of frameworks (Express/React Native) and databases (MongoDB).

## Backend Directory Structure

```text
backend/
├── src/
│   ├── app.ts                 # Express Application Entry Point
│   ├── server.ts              # Server Bootstrapper
│   ├── entities/              # Domain Layer: Interfaces & Enums (No dependencies)
│   ├── database/              # Data Layer: Mongoose Models & Schemas
│   ├── repositories/          # Interface Adapters: Database Abstraction (CRUD)
│   ├── use-cases/             # Application Layer: Business Logic operations
│   ├── controllers/           # Presentation Layer: Express Request/Response handling
│   ├── routes/                # Express Routing & Middleware application
│   ├── middlewares/           # Auth, Role, Rate Limiting, Error Handling
│   ├── types/                 # Express global type extensions
│   └── tests/                 # Jest Unit & Integration test suites
```

### Architectural Flow (Example: Fetching Vehicles)
1. **Client** -> HTTP GET `/api/v1/vehicles`
2. **Router** (`vehicleRoutes.ts`) -> validates authentication/route -> passes to Controller.
3. **Controller** (`vehicleController.ts`) -> parses query strings -> passes to Use Case.
4. **Use Case** (`GetVehicles.ts`) -> enforces business rules -> calls Repository.
5. **Repository** (`VehicleRepository.ts`) -> executes optimized query on MongoDB Model.
6. **Data** flows back up the chain and Controller responds with `JSON`.

## Mobile Directory Structure

We use a **Feature-Based Architecture** to keep related components physically grouped, drastically reducing cognitive load as the app scales.

```text
mobile/
├── src/
│   ├── features/
│   │   ├── auth/              # Login, Register screens
│   │   ├── home/              # Home layout
│   │   ├── search/            # Advanced search, Saved searches
│   │   ├── selling/           # Multi-step listing workflow
│   │   ├── favorites/         # Favorited items UI
│   │   ├── compare/           # Vehicle comparison matrix
│   │   ├── messaging/         # Chat and Inbox
│   │   ├── profile/           # Seller Dashboard, My Listings
│   │   └── admin/             # Platform Analytics, Content Moderation
│   ├── navigation/            # AppNavigator (Tabs + Stack)
│   ├── services/              # Axios API implementations
│   ├── store/                 # Zustand Global State (AuthStore, CompareStore)
│   ├── components/            # Shared UI (EmptyState, FadeInView)
│   └── types/                 # TypeScript interfaces synced with backend
```
