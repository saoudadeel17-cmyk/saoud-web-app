# SAQR Heritage Exports

Luxury e-commerce storefront for handcrafted Persian rugs, Arabian mats, and traditional crafts — exported worldwide from Pakistan.

Built with **Next.js 16** (App Router), **Supabase** (auth + database), **Stripe**, and **Resend**.

## Features

- Product catalog with categories, search, and multi-currency pricing
- Supabase authentication (signup, login, email verification)
- Shopping cart and checkout (JazzCash, bank transfer, COD, Stripe)
- Customer dashboard (orders, profile, settings)
- Admin dashboard (orders, products, users)
- Contact form with email notifications via Resend

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- (Optional) [Resend](https://resend.com) API key for emails
- (Optional) [Stripe](https://stripe.com) keys for card payments

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_EMAIL=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

Run the database schema from `lib/db/schema.sql` in the Supabase SQL Editor. If orders fail with RLS errors, apply `lib/db/fix-all-rls.sql` (or `npm run db:fix-rls` with `DATABASE_URL` set).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run db:fix-rls` | Apply RLS fix script to Supabase |

## Contact

- **Email:** [saoudadeel17@gmail.com](mailto:saoudadeel17@gmail.com)
- **WhatsApp:** [+92 311 4101497](https://wa.me/923114101497)
- **Hours:** Mon – Sat, 9am – 8pm PKT
- **Location:** Pakistan · Exporting Worldwide

## Deploy

Deploy to [Vercel](https://vercel.com) and add the environment variables above. Set `NEXT_PUBLIC_APP_URL` to your production domain.
