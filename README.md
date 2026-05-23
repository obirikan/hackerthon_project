# Phasion Sense — Sylvara

Premium fashion e-commerce storefront for the **AI Fashion Retail Hackathon** (CODED).

Built for **Phasion Sense** (`phasion-sense`) by team **Sylvara** (`sylvara-team`).

## Features

- **Inventory** — Live product grid from `GET /merchants/phasion-sense/items`
- **Product detail** — `GET /items/{id}` with add-to-basket
- **WhatsApp checkout** — Local basket → `POST /baskets` → basket summary → WhatsApp deep link
- **Campaigns** — `GET /merchants/phasion-sense/campaigns?team_slug=sylvara-team`
- **Admin — Create campaign** — `/admin/campaigns` → `POST /campaigns` (with image upload)

## Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind CSS v3
- Deploy-ready for [Vercel](https://vercel.com)

## Environment

Copy `.env.local.example` to `.env.local` (optional — defaults are set):

```bash
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=phasion-sense
NEXT_PUBLIC_TEAM_SLUG=sylvara-team
NEXT_PUBLIC_TEAM_NAME=Sylvara
```

## Development

```bash
npm install
npm run dev
```

Or after cache issues:

```bash
npm run dev:clean
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
- `merchant_id` in POST bodies is the merchant slug/UUID from the API (`phasion-sense`)
- `team_slug` is sent on all basket and campaign requests
