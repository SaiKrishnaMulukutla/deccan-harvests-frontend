# Deccan Harvests — Backend Plan

## Philosophy

This is **business operations infrastructure**, not high-frequency distributed systems.

| Priority Order | Principle |
|---|---|
| 1 | Reliability over complexity |
| 2 | Maintainability over trendy tech |
| 3 | Uptime over microservice purity |
| 4 | Simplicity over cleverness |

The architecture is a **modular monolith** — one deployable unit, internally well-separated by domain.
Splitting into microservices later is possible but will never be needed unless we hit serious scale.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS | Stable, vast ecosystem, team familiarity |
| Framework | NestJS | Enforces structure, DI, decorators, modular by default |
| Database | PostgreSQL 16 | Relational, ACID, battle-tested for B2B ops |
| ORM | Prisma | Type-safe, excellent migrations, readable schema |
| Auth | JWT + HttpOnly Cookies | Stateless tokens, XSS-safe cookie transport |
| Validation | class-validator + Zod | class-validator for DTO pipes, Zod for runtime parsing |
| File Storage | AWS S3 | Certifications, product images, shipping docs |
| Email | Resend | Developer-friendly, reliable delivery |
| Cache | Redis (Phase 2) | Session caching, rate limiting, queue backing |
| Job Queue | BullMQ (Phase 2) | Email jobs, report generation, async tasks |
| Deployment | Docker + Docker Compose | Reproducible environments, easy server deploy |
| Reverse Proxy | Nginx | SSL termination, static files, upstream proxy |
| CDN | Cloudflare | DDoS protection, edge caching, DNS |

---

## System Architecture

```
Browser / Next.js Frontend
         │
         │ HTTPS (Cloudflare CDN)
         ▼
      Nginx
    (SSL term + proxy)
         │
         ▼
   NestJS API Server
   (single process, multiple modules)
         │
    ┌────┴────┐
    ▼         ▼
PostgreSQL   Redis (Phase 2)
(Prisma ORM) (BullMQ backing)
         │
         ▼
      AWS S3
   (file storage)
```

---

## Folder Architecture

```
src/
│
├── auth/                   # JWT login, refresh, logout, cookie management
├── users/                  # User accounts, roles, profile management
│
├── products/               # Product catalog — Teja, Byadgi, Turmeric etc.
├── rfq/                    # Request for Quote submissions from website form
├── inquiries/              # General contact / follow-up inquiries
│
├── export/                 # Export documents, shipment records, HS codes
├── certifications/         # ISO, HACCP, APEDA — upload, manage, display
├── media/                  # S3 upload/delete, image processing, file records
│
├── logistics/              # Shipment tracking, container info, port details
├── admin/                  # Admin dashboard APIs — stats, overrides, reports
├── analytics/              # Query layers for metrics (orders, countries, volume)
├── notifications/          # Email triggers via Resend (RFQ received, status updates)
│
├── common/                 # Shared DTOs, base entities, generic response types
├── config/                 # Environment config, validation schema (Zod)
├── database/               # Prisma module, DB service wrapper
├── middleware/              # Logger, request ID injection, CORS
├── guards/                 # JwtAuthGuard, RolesGuard, AdminGuard
├── interceptors/           # Response transform, error normalize, logging
└── utils/                  # Date helpers, slug generators, pagination, crypto
```

---

## Module Breakdown

### `auth/`
- `POST /auth/login` — validate credentials, issue JWT in HttpOnly cookie
- `POST /auth/logout` — clear cookie
- `POST /auth/refresh` — rotate access token using refresh token
- `GET  /auth/me` — return current user from token
- Strategy: Passport.js `passport-jwt` + `passport-local`
- Tokens: access (15min) + refresh (7d) stored as HttpOnly Secure cookies

### `users/`
- Admin user management (create, update, deactivate)
- Roles: `ADMIN`, `MANAGER`, `VIEWER`
- Passwords: bcrypt, min 12 rounds
- No self-registration — admin-only user creation

### `products/`
- Full CRUD for product catalog
- Fields: name, slug, variety, SHU, ASTA colour value, moisture %, description, images
- Status: `ACTIVE` | `INACTIVE` | `SEASONAL`
- Public endpoint for frontend (no auth)
- Admin endpoints for create/update/delete (JWT required)

### `rfq/`
- `POST /rfq` — public, receives website form submissions
- Fields: name, email, country, product, quantity, message
- Triggers: email notification to admin + auto-acknowledgement to buyer
- Status flow: `NEW` → `IN_REVIEW` → `QUOTED` → `CLOSED`
- Admin: list, filter by status/country/product, update status, add internal notes

### `inquiries/`
- General contact form submissions
- Simpler than RFQ — no quote workflow, just inbox management

### `export/`
- Shipment records: container number, vessel, port of loading, destination port
- Documents: Bill of Lading, Phytosanitary cert, Certificate of Origin (linked to S3)
- Export countries and volume data (feeds analytics)

### `certifications/`
- Store certification metadata + S3 link to PDF
- Fields: name, issuing body, issue date, expiry date, certificate number, file URL
- Public: list active certifications
- Admin: upload, update, mark expired

### `media/`
- Centralised S3 wrapper: upload, delete, generate presigned URL
- Validate: file type (jpg/png/pdf/webp), max size 10MB
- Returns CDN URL after upload
- Tracks all uploaded files in DB with owner reference

### `logistics/`
- Shipment status updates (manual entry by admin)
- Linked to RFQ/order records
- Port and freight partner reference data

### `admin/`
- Dashboard aggregate: total RFQs, RFQs by status, top countries, recent activity
- Bulk operations: export RFQs as CSV, mark multiple as reviewed
- Only accessible with `ADMIN` role

### `analytics/`
- No external analytics service — pure DB queries
- Metrics: monthly volume, RFQ conversion rate, top products by inquiry
- Feeds the admin dashboard

### `notifications/`
- Thin wrapper around Resend
- Templates: RFQ received (to admin), RFQ acknowledgement (to buyer), quote sent
- Queue-backed in Phase 2 (BullMQ), direct call in Phase 1
- All sends logged to DB (recipient, template, status, timestamp)

---

## Database Schema (Prisma — key models)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(VIEWER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  variety     String?
  shuMin      Int?
  shuMax      Int?
  astaValue   String?
  moisture    String?
  description String?
  status      ProductStatus @default(ACTIVE)
  images      MediaFile[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model RFQ {
  id          String    @id @default(cuid())
  name        String
  email       String
  country     String
  product     String
  quantity    String
  message     String?
  status      RFQStatus @default(NEW)
  internalNote String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Certification {
  id            String    @id @default(cuid())
  name          String
  issuingBody   String
  certNumber    String?
  issuedAt      DateTime
  expiresAt     DateTime?
  fileUrl       String
  active        Boolean   @default(true)
  createdAt     DateTime  @default(now())
}

model MediaFile {
  id         String   @id @default(cuid())
  key        String   @unique   // S3 object key
  url        String             // CDN/public URL
  mimeType   String
  sizeBytes  Int
  uploadedBy String
  createdAt  DateTime @default(now())
  product    Product? @relation(fields: [productId], references: [id])
  productId  String?
}

model NotificationLog {
  id         String   @id @default(cuid())
  recipient  String
  template   String
  status     String   // "sent" | "failed"
  error      String?
  sentAt     DateTime @default(now())
}

enum Role          { ADMIN MANAGER VIEWER }
enum RFQStatus     { NEW IN_REVIEW QUOTED CLOSED }
enum ProductStatus { ACTIVE INACTIVE SEASONAL }
```

---

## API Design Conventions

- All routes prefixed `/api/v1/`
- Response envelope:
  ```json
  { "success": true, "data": {}, "meta": {} }
  { "success": false, "error": { "code": "RFQ_NOT_FOUND", "message": "..." } }
  ```
- Pagination: `?page=1&limit=20` → `meta: { total, page, limit, totalPages }`
- Errors: never leak stack traces in production. NestJS `HttpException` filters.
- Validation: `ValidationPipe` globally, `whitelist: true`, `forbidNonWhitelisted: true`

---

## Auth Flow

```
1. POST /auth/login
   → validate email + password
   → sign accessToken (15min JWT) + refreshToken (7d JWT)
   → set both as HttpOnly Secure SameSite=Strict cookies
   → return { user: { id, email, role } }

2. Every protected request
   → JwtAuthGuard reads token from cookie (not Authorization header)
   → validates signature + expiry
   → attaches user to request context

3. Token refresh
   → POST /auth/refresh
   → validates refreshToken cookie
   → issues new accessToken + new refreshToken (rotation)

4. Logout
   → POST /auth/logout
   → clears both cookies (maxAge: 0)
```

---

## Security Checklist

- [ ] `helmet()` — HTTP security headers
- [ ] `cors()` — whitelist frontend origin only
- [ ] `express-rate-limit` on `/auth/*` and `/rfq`
- [ ] bcrypt min 12 rounds for passwords
- [ ] `ValidationPipe` globally with `whitelist: true`
- [ ] HttpOnly + Secure + SameSite=Strict cookies
- [ ] All S3 buckets private — presigned URLs for access
- [ ] No raw SQL — Prisma parameterised queries only
- [ ] Env vars validated at startup via Zod schema
- [ ] Never log passwords, tokens, or PII

---

## Environment Variables

```env
# App
NODE_ENV=production
PORT=4000
API_URL=https://api.deccanharvests.com

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/deccan_harvests

# JWT
JWT_ACCESS_SECRET=<256-bit random>
JWT_REFRESH_SECRET=<256-bit random>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=deccan-harvests-media

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@deccanharvests.com
ADMIN_EMAIL=exports@deccanharvests.com

# Redis (Phase 2)
REDIS_URL=redis://localhost:6379
```

---

## Build Order

### Phase 1 — Core (Build This First)

- [ ] `nest new deccan-harvests-backend`
- [ ] Prisma setup — schema, migrations, seed
- [ ] `config/` — env validation with Zod, ConfigModule
- [ ] `database/` — PrismaModule, PrismaService
- [ ] Global pipes, filters, interceptors wired in `main.ts`
- [ ] `auth/` — login, logout, refresh, JWT cookie strategy
- [ ] `users/` — admin user CRUD, role guard
- [ ] `products/` — full CRUD, public list endpoint
- [ ] `rfq/` — public submission + admin management + email trigger
- [ ] `certifications/` — upload, list, public endpoint
- [ ] `media/` — S3 upload wrapper
- [ ] `notifications/` — Resend integration, log to DB

### Phase 2 — Operations

- [ ] `export/` — shipment records, document management
- [ ] `logistics/` — tracking, port data
- [ ] `admin/` — dashboard aggregates, CSV export
- [ ] `analytics/` — DB-query metrics layer

### Phase 3 — Infrastructure

- [ ] Redis integration (session caching, rate limit store)
- [ ] BullMQ — email jobs, async processing
- [ ] Docker Compose — app + postgres + redis
- [ ] Nginx config — SSL termination, proxy, gzip
- [ ] CI/CD — GitHub Actions → Docker build → VPS deploy

---

## Project Structure (File Level)

```
deccan-harvests-backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts                 # Bootstrap, global pipes/filters
│   ├── app.module.ts           # Root module
│   │
│   ├── config/
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   │   └── env.schema.ts       # Zod env validation
│   │
│   ├── database/
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── common/
│   │   ├── dto/
│   │   │   ├── pagination.dto.ts
│   │   │   └── response.dto.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── response-transform.interceptor.ts
│   │   └── decorators/
│   │       ├── current-user.decorator.ts
│   │       └── roles.decorator.ts
│   │
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── dto/
│   │       └── login.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   │
│   ├── rfq/
│   │   ├── rfq.module.ts
│   │   ├── rfq.controller.ts
│   │   ├── rfq.service.ts
│   │   └── dto/
│   │       ├── create-rfq.dto.ts
│   │       └── update-rfq-status.dto.ts
│   │
│   ├── certifications/
│   │   ├── certifications.module.ts
│   │   ├── certifications.controller.ts
│   │   ├── certifications.service.ts
│   │   └── dto/
│   │       └── create-certification.dto.ts
│   │
│   ├── media/
│   │   ├── media.module.ts
│   │   ├── media.service.ts
│   │   └── s3.service.ts
│   │
│   └── notifications/
│       ├── notifications.module.ts
│       ├── notifications.service.ts
│       └── templates/
│           ├── rfq-received.template.ts
│           └── rfq-acknowledgement.template.ts
│
├── test/
│   └── app.e2e-spec.ts
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── package.json
```

---

## Docker Setup (Phase 3)

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports: ["4000:4000"]
    env_file: .env
    depends_on: [postgres]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: deccan_harvests
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## What This Is NOT

- Not microservices — one repo, one deployable
- Not GraphQL — REST is sufficient, maintainable, documented
- Not event-sourced — CRUD with audit fields is enough
- Not Kubernetes — a single $20 VPS handles this load comfortably
- Not real-time — no WebSockets needed for an export B2B site
