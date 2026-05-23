# Mensah — Sylvara

Premium fashion e-commerce storefront for the **AI Fashion Retail Hackathon** (CODED).

**Mensah** brand storefront powered by **Kofi Menswear** inventory (`kofi-menswear`) · team **Sylvara** (`sylvara-team`).

## Features

- **Inventory** — Live product grid from `GET /merchants/kofi-menswear/items`
- **Product detail** — `GET /items/{id}` with add-to-basket
- **WhatsApp checkout** — Local basket → `POST /baskets` → basket summary → WhatsApp deep link
- **Campaigns** — `GET /merchants/kofi-menswear/campaigns?team_slug=sylvara-team`
- **Admin — Create campaign** — `/admin/campaigns` → `POST /campaigns` (with image upload)
- **Team registration** — `/setup` → `POST /teams`

## Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS v4
- Deploy-ready for [Vercel](https://vercel.com)

## Environment

Copy `.env.local.example` to `.env.local` (optional — defaults are set):

```bash
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=kofi-menswear
NEXT_PUBLIC_TEAM_SLUG=sylvara-team
NEXT_PUBLIC_TEAM_NAME=Sylvara
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

```bash
npm run build
```

Deploy the repo to Vercel and set the env vars above if you change slugs.

## API notes

- Prices use **minor units** (÷ 100 for display)
- Basket items use `qty`, not `quantity`
- `merchant_id` in POST bodies is the merchant slug/UUID from the API (`kofi-menswear`)
- `team_slug` is sent on all basket and campaign requests
