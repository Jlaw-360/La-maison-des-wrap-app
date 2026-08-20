---
name: cloudflare-deployment
description: Guide and best practices for deploying static assets, React Native Web, and Edge Functions on Cloudflare Pages and Cloudflare Workers with zero downtime and unlimited bandwidth.
---

# Cloudflare Deployment Engine

## 1. Project Configuration (`wrangler.toml`)
```toml
name = "la-maison-des-wrap-app"
account_id = "c67bc5032024bb38d910f5a0723fc3fa"
compatibility_date = "2024-01-01"
main = "worker.js"

[assets]
directory = "."

[vars]
SUPABASE_URL = "https://zldxbaykxgdraxvejkdr.supabase.co"
NEXT_PUBLIC_SUPABASE_URL = "https://zldxbaykxgdraxvejkdr.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy"
SUPABASE_PROJECT_ID = "zldxbaykxgdraxvejkdr"
BETTER_AUTH_API_KEY = "ba_hed5bolcn4cj17vepv1wjd1d8nk04pif"
```

## 2. Edge Routing & Functions (`functions/api/`)
* `_redirects`: Clean SPA routing for `/kitchen`, `/driver`, `/admin`, `/order`.
* `_headers`: Security headers, CORS preflight (`OPTIONS 204`), and cache-control.
* `functions/api/auth/[[catchall]].js`: BetterAuth Edge handler.
* `functions/api/calculate-distance.js`: Real-time delivery fee calculation.
* `functions/api/create-payment-intent.js`: Stripe payment processing.

## 3. Deployment Workflow
* Direct Git integration: Automatic deployment on push to `main`.
* CLI Deployment: `npx wrangler pages deploy . --project-name=la-maison-des-wrap-app`.
