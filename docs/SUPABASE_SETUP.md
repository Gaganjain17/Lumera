Supabase migration of backend storage

Overview
- Data moved from localStorage/in-memory to Supabase tables.
- API routes now back admin CRUD for categories, products, inquiries, and bank details.

Prerequisites
- Supabase project created.
- You have the following keys in .env.local (project root):
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (server only; used for seeding)

Apply schema
- Open Supabase SQL Editor and run docs/supabase-schema.sql

Seed initial data
- Run: npm run db:seed
- Seeds: categories, products, bank_details (single-row table)

API routes wired to Supabase
- Categories: GET/POST/PATCH/DELETE at src/app/api/categories/route.ts
- Products: GET/POST/PATCH/DELETE at src/app/api/products/route.ts
- Inquiries: GET/POST/PATCH/DELETE at src/app/api/inquiries/route.ts
- Bank details: GET/PUT at src/app/api/bank-details/route.ts

Admin UI updated
- Category Manager uses /api/categories
- Product Manager uses /api/products
- Inquiries Manager uses /api/inquiries
- Bank Details Manager uses /api/bank-details

Notes
- Client lib: src/lib/supabaseClient.ts
- Seed script: scripts/seed-supabase.ts (loads .env.local)
- Existing localStorage helpers remain for fallback but are no longer used by admin flows.

Troubleshooting
- Duplicate handler errors: ensure only one GET/POST/PATCH/DELETE function per route file.
- Env not loading for seeding: confirm .env.local exists at project root and rerun npm run db:seed.

