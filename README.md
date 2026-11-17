# Jollivo

Food delivery app, split into two parts:

| Folder | What it is | Runs at |
|---|---|---|
| `frontend/` | The app customers use (Next.js, React, Tailwind, Clerk login) | https://localhost:3000 |
| `backend/` | The API server (Node.js, Express, TypeScript) | https://localhost:4000 |

## Running it

Open two terminals in this folder.

```bash
npm run dev:frontend   # terminal 1
npm run dev:backend    # terminal 2
```

First time on a new machine, install both sets of packages with `npm run install:all`.

## Backend

Settings live in `backend/.env` (copy `backend/.env.example` to create it).

| Method | Path | Sign-in needed | Purpose |
|---|---|---|---|
| GET | `/health` | no | Check the server is up |
| GET | `/api/categories` | no | Food categories |
| GET | `/api/restaurants?category=&q=` | no | List or search restaurants |
| GET | `/api/restaurants/:id` | no | One restaurant with its menu |
| GET | `/api/orders` | yes | The signed-in user's orders |
| GET | `/api/orders/:id` | yes | One order |
| POST | `/api/orders` | yes | Place an order |

**API documentation (Swagger):** open https://localhost:4000/docs while the backend is running. The raw OpenAPI file is at `/docs.json`. The docs are defined in `backend/src/docs/openapi.ts`.

Signed-in requests send the Clerk session token as `Authorization: Bearer <token>`.

`POST /api/orders` body:

```json
{
  "restaurantId": "mama-jollof",
  "items": [{ "id": "jollof-chicken", "qty": 2 }],
  "address": "12 Admiralty Way, Lekki, Lagos",
  "note": "Call on arrival"
}
```

Layout:

```
backend/src/
  server.ts            starts the server (HTTP or HTTPS)
  app.ts               wires middleware and routes together
  config.ts            reads settings from .env
  routes/              one file per group of endpoints
  db/migrate.ts        runs the migrations
  docs/openapi.ts      the Swagger / OpenAPI description
  validation/          rules for incoming data (one file per group of endpoints)
  middleware/          sign-in check and error handling
  data/restaurants.ts  restaurant and menu data
  store/orders.ts      where orders are kept (in memory for now)
```

### Database

The backend uses PostgreSQL. The connection is `DATABASE_URL` in `backend/.env`.
Table changes are written as migrations: plain SQL files in `backend/migrations/`.

```bash
cd backend
npm run migrate          # apply migrations that haven't run yet
npm run migrate:status   # show which have run
npm run migrate:undo     # undo the most recent one (deletes its tables and data)
```

To change the tables later, add a new pair of files with the next number, for
example `0002_add_riders.up.sql` and `0002_add_riders.down.sql`. Don't edit a
migration that has already been applied.

Tables: `categories`, `restaurants`, `menu_items`, `orders`, `order_items`.
Users live in Clerk; `orders.user_id` holds the Clerk user id.

### Not done yet

- **The API doesn't use the database yet.** The tables exist, but they are empty: restaurants still come from `data/restaurants.ts` and orders are kept in memory (`store/orders.ts`), so orders are lost when the backend restarts.
- **The frontend does not call the backend yet.** It still reads restaurants from `frontend/lib/data.ts` and keeps the cart and orders in the browser.
- **Order status is simulated** (it advances every two minutes); there are no restaurant or rider updates.
- **No payments.**
