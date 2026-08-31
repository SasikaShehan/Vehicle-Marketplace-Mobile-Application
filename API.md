# REST API Documentation

Base URL: `/api/v1`

## 1. Authentication (`/auth`)
- `POST /register`: Register a new user (`email`, `password`, `fullName`, `role`).
- `POST /login`: Authenticate and receive `accessToken` and `refreshToken`.
- `POST /refresh`: Trade a valid `refreshToken` for a new `accessToken`.
- `POST /logout`: Invalidate session.
- `GET /me`: Get active user profile data.

## 2. Vehicles (`/vehicles`)
- `GET /`: Retrieve published vehicles (Supports filters: `make`, `model`, `minPrice`, `maxPrice`, `year`, `sort`).
- `GET /:id`: Get specific vehicle details.
- `POST /`: Create a new vehicle listing (Requires `Seller` or `Admin` role).
- `PATCH /:id`: Update listing details.
- `DELETE /:id`: Remove listing.
- `GET /me/listings`: (Seller Only) Retrieve all vehicles owned by logged-in user regardless of status.
- `PATCH /:id/status`: Update status (e.g. `Draft`, `Sold`).

## 3. Favorites (`/favorites`)
- `GET /`: Retrieve user's favorited vehicles.
- `POST /toggle`: Add or remove a vehicle from favorites (`vehicleId`).

## 4. Chat & Notifications (`/chat` & `/notifications`)
- `GET /chat/conversations`: Get all active chats for user.
- `POST /chat/conversations`: Initialize a chat for a specific vehicle and seller.
- `GET /chat/conversations/:id/messages`: Get message history.
- `POST /chat/conversations/:id/messages`: Send a new message.
- `GET /notifications`: Get system notifications.
- `PATCH /notifications/:id/read`: Mark alert as read.

## 5. Analytics & Saved Searches (`/analytics` & `/saved-searches`)
- `GET /analytics/seller/dashboard`: Get aggregated stats (Total, Active, Sold, Views) for seller.
- `POST /saved-searches`: Save a search query criteria object.
- `GET /saved-searches`: Retrieve all saved queries.
- `DELETE /saved-searches/:id`: Remove a saved query.

## 6. Admin Portal (`/admin`)
- `GET /admin/analytics`: Get platform-wide aggregated metrics.
- `GET /admin/vehicles/pending`: Retrieve listings awaiting moderation.
- `PATCH /admin/vehicles/:id/moderate`: Approve or Reject a listing.
