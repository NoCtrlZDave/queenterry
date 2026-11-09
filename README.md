# Queen Terry Store

Premium smartphones, computers, audio, wearables, accessories and gadgets — built as a modern storefront with **WhatsApp ordering only**. There is no payment gateway: customers build a cart, submit delivery details, and the site opens a pre-filled WhatsApp chat so Queen Terry can confirm availability, delivery and payment directly.

Prices are displayed in Nigerian Naira (₦). The configured store WhatsApp number is **09025068558** (international: `2349025068558`).

## Features

- Premium, Samsung-inspired responsive storefront with announcement bar, mega menu, search, wishlist and mobile bottom navigation.
- Catalogue with categories, brands, featured products, deals, filters, sorting, search and product detail pages.
- Cart, guest or signed-in checkout, delivery details and WhatsApp order handoff.
- Order confirmation page with order number, copyable order summary and WhatsApp link.
- Customer accounts: register, sign in, profile, addresses, saved items and order history with re-order.
- Admin console: analytics dashboard, product CRUD with image uploads, order management (status + payment state), customers and store settings.
- Store settings control the WhatsApp number, support contacts, announcement bar, delivery fee/threshold and social links.
- Server-side price and stock validation at order creation; order lookup requires the order's phone number or an authenticated owner.

## Tech stack

- **Client:** React 18, Vite 6, React Router 6, Tailwind CSS 3, Framer Motion, Lucide icons.
- **Server:** Node.js, Express 4, Mongoose 8, JWT cookie auth, bcryptjs, Multer, Helmet, express-rate-limit.
- **Database:** MongoDB (local or Atlas). An in-memory MongoDB option is included for local verification.

## Quick start

Prerequisites: Node.js 18+ and npm. MongoDB is optional if you use `memory://`.

```powershell
# 1. Install dependencies for the root, server and client
npm run install:all

# 2. Configure the server
Copy-Item server/.env.example server/.env
# Edit server/.env (see the environment table below)

# 3. Seed the store (admin account, categories, brands, settings, demo products)
npm run seed

# 4. Run API + web app together
npm run dev
```

- Storefront: http://localhost:5173
- API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

The Vite dev server proxies `/api` and `/uploads` to the API on port 5000.

### In-memory database (quick local demo)

Set `MONGODB_URI=memory://` in `server/.env`. This starts a temporary MongoDB process through `mongodb-memory-server`; **all data is lost when the server stops**. On startup, if the catalogue is empty and `SEED_DEMO=true`, the server seeds itself automatically.

For real use, point `MONGODB_URI` at a local MongoDB or MongoDB Atlas cluster.

### Seed credentials

- Admin email: `admin@queenterry.test`
- Admin password: value of `ADMIN_PASSWORD` in `server/.env` (default `ChangeMe123!`)

Change the admin password and `JWT_SECRET` before deploying.

### Demo data

The seed includes 32 clearly marked demo products so the storefront is usable immediately. Their prices, specs and availability are placeholders and must be confirmed with Queen Terry. Product photos are illustrative SVGs until real images are uploaded in the admin console.

## Environment variables

`server/.env`:

| Variable | Purpose | Default / example |
| --- | --- | --- |
| `PORT` | API port | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `MONGODB_URI` | MongoDB connection string, or `memory://` | `mongodb://127.0.0.1:27017/queen_terry` |
| `JWT_SECRET` | Long random secret used to sign auth cookies | required in production |
| `JWT_EXPIRES_IN` | Auth cookie lifetime | `7d` |
| `CLIENT_ORIGIN` | Allowed CORS origin in development | `http://localhost:5173` |
| `ADMIN_NAME` | Seeded admin display name | `Queen Terry Admin` |
| `ADMIN_EMAIL` | Seeded admin email | `admin@queenterry.test` |
| `ADMIN_PASSWORD` | Seeded admin password | change before deploy |
| `ADMIN_PHONE` | Seeded admin phone | `09025068558` |
| `WHATSAPP_NUMBER` | Store WhatsApp number, digits only, international format | `2349025068558` |
| `SEED_DEMO` | Include demo products during seeding | `true` |

`client/.env` (optional, for separate API hosting):

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API origin when the client is not served by the API (e.g. `https://api.example.com`) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run install:all` | Install root, server and client dependencies |
| `npm run dev` | Run API (nodemon) and client (Vite) together |
| `npm run seed` | Reset and seed categories, brands, settings, admin and demo products |
| `npm run build` | Build the client into `client/dist` |
| `npm start` | Start the production API (serves `client/dist` when present) |

## WhatsApp ordering flow

1. Customer adds products to the cart and proceeds to checkout.
2. Checkout collects name, phone, delivery address, city/state and optional notes.
3. The server re-checks stock and prices, calculates the delivery fee from store settings, creates an order with status `awaiting_whatsapp`, and returns a pre-filled message and `wa.me` link.
4. The customer is sent to WhatsApp with the order reference, items, subtotal and delivery details.
5. Queen Terry confirms availability, delivery cost and payment method in the chat, then updates the order in the admin console.

Orders are not paid or confirmed automatically — WhatsApp is the confirmation channel.

## API overview

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `/login`, `/logout`, `/forgot-password`, `/reset-password`; `GET /api/auth/me` |
| Profile & addresses | `PATCH /api/auth/profile`, `/password`; address add/update/delete under `/api/auth/addresses` |
| Catalogue | `GET /api/products`, `/api/products/:slug`, `/api/categories`, `/api/brands`, `/api/settings` |
| Orders | `POST /api/orders`; `GET /api/orders/my`; `GET /api/orders/:orderNumber` (phone or owner required) |
| Newsletter | `POST /api/newsletter` |
| Admin | `/api/admin/analytics`, products, orders, customers, settings, upload (JWT admin role required) |

## Production deployment

1. **Database:** use a persistent MongoDB (Atlas or self-hosted). Do not use `memory://`.
2. **Secrets:** set a long random `JWT_SECRET`, a strong `ADMIN_PASSWORD`, and change the seeded admin email if desired. Run `npm run seed` once against the production database, then keep `SEED_DEMO=false` if you do not want demo products.
3. **Build:** `npm run install:all` then `npm run build`.
4. **Start:** `NODE_ENV=production npm start`. Express serves `client/dist` with SPA fallback, so the storefront and API share one origin.
5. **Client origin:** if you host the client separately, set `VITE_API_URL` for the client and `CLIENT_ORIGIN` on the server to the client URL.
6. **Uploads:** product images are written to `server/uploads`. On ephemeral hosts (Render, Railway, containers), mount a persistent disk or switch the uploader to S3/Cloudinary before going live.
7. **Password reset email:** the reset endpoint currently logs the token in development and returns it in non-production. Connect an email provider (e.g. Resend/SendGrid) or a support workflow before relying on self-service resets in production.
8. **CORS and cookies:** auth uses HTTP-only cookies. Serve over HTTPS in production and keep client and API on origins that are allowed by `CLIENT_ORIGIN`.

### Deployment checklist

- [ ] Persistent MongoDB configured
- [ ] `NODE_ENV=production`
- [ ] Strong `JWT_SECRET` and admin password
- [ ] `CLIENT_ORIGIN` set to the public storefront URL
- [ ] `WHATSAPP_NUMBER` verified with a test order
- [ ] Client built with `npm run build`
- [ ] Persistent storage configured for uploads
- [ ] HTTPS enabled
- [ ] Demo catalogue replaced with real products and photos

## Project structure

```
.
├─ client/                 React storefront
│  ├─ public/              Static assets and favicon
│  └─ src/
│     ├─ components/       Layout, product, cart, home, admin and UI components
│     ├─ context/          Auth, cart, catalogue, store, wishlist, toast
│     ├─ hooks/            Reusable hooks
│     ├─ lib/              API client, formatting, WhatsApp helpers
│     └─ pages/            Storefront, account, auth, admin and static pages
├─ server/
│  ├─ src/
│  │  ├─ config/           Environment and database setup
│  │  ├─ controllers/      Auth, catalogue, order and admin logic
│  │  ├─ middleware/       Auth guards, uploads, errors, rate limits
│  │  ├─ models/           Mongoose schemas
│  │  ├─ routes/           Express route definitions
│  │  └─ utils/            Seed, WhatsApp message, tokens, slugs
│  └─ uploads/             Uploaded product images
└─ package.json            Root install/dev/build/start scripts
```

## Notes and limitations

- No online payment integration by design. Checkout always ends in a WhatsApp conversation.
- The included demo catalogue is placeholder data; replace it with Queen Terry's real stock, prices and photography via the admin console.
- Product images fall back to a branded illustration when no photo is uploaded.
- The in-memory database is for local verification only.
- Automated tests are not included; verify critical flows manually after deploying (see checklist).
