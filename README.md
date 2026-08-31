# Vehicle Marketplace

A full-stack, enterprise-grade mobile application platform for buying, selling, and managing vehicles. Built specifically to demonstrate scalable software architecture, modern UI/UX principles, and secure API design.

## Features

- **Multi-Role Authentication**: Secure JWT-based RBAC (Role-Based Access Control) for Buyers, Sellers, and Admins. Rate-limited to prevent brute-force attacks.
- **Advanced Search Engine**: Regex-powered search capabilities with complex dynamic filtering (make, model, year, price bounds) and intelligent sorting algorithms.
- **Seller Workflows**: Multi-step ad creation UI, state-machine listing management (Draft -> Pending -> Published -> Sold), and an analytics dashboard calculating live views and listing states.
- **Real-Time Communication**: Simulated real-time buyer-seller direct messaging and notification engine.
- **Admin Moderation Portal**: Secure interface for administrators to evaluate pending vehicle submissions and track platform-wide vital statistics.
- **UX Enhancements**: Reusable native driver micro-animations (FadeIn, SlideUp), clean Empty States, and robust client-side state caching using Zustand & React Query.

## Technology Stack

### Backend
- **Node.js & Express**: Core runtime and framework.
- **TypeScript**: Strict type-checking and interface definitions.
- **MongoDB & Mongoose**: NoSQL database with optimized compound indexing.
- **Jest**: Unit and integration testing framework.
- **Security**: Helmet, Express Rate Limit, bcrypt, JSON Web Tokens.

### Mobile Frontend
- **React Native**: Cross-platform mobile architecture.
- **TypeScript**: Unified typing with backend domains.
- **React Navigation**: Complex Stack-within-Tab routing.
- **Zustand**: Lightweight global state management (Auth, Compare module).
- **React Query**: Intelligent, automated server-state caching and fetching.
- **Lucide Icons**: Premium vector icon set.

## Running the Project

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your details (especially `MONGO_URI` and `JWT_SECRET`).
4. Run `npm run seed` to populate the database with realistic test vehicles and demo accounts.
5. `npm run dev` (Runs on port 5000)

**Demo Accounts (Password for all: `Password123!`):**
- **Admin**: `admin@demo.com`
- **Seller**: `seller@demo.com`
- **Buyer**: `buyer@demo.com`

### Mobile Setup
1. `cd mobile`
2. `npm install`
3. Update `mobile/src/services/api.ts` to point to your machine's local IP address (e.g. `http://192.168.1.5:5000/api/v1`) if testing on a physical device.
4. `npm run start`

## Documentation

- `ARCHITECTURE.md`: Detailed breakdown of the Clean Architecture pattern utilized on the backend.
- `API.md`: Comprehensive API contract definitions for all major modules.
