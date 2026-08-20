---
name: vercel-deployment
description: Guide and best practices for deploying high-performance serverless web applications and API routes on Vercel.
---

# Vercel Deployment Engine

## 1. Configuration (`vercel.json`)
```json
{
  "version": 2,
  "rewrites": [
    { "source": "/kitchen", "destination": "/kitchen.html" },
    { "source": "/driver", "destination": "/driver.html" },
    { "source": "/admin", "destination": "/admin.html" },
    { "source": "/api/auth/:path*", "destination": "/api/auth.js" },
    { "source": "/api/:match*", "destination": "/api/:match*" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
      ]
    }
  ]
}
```

## 2. Serverless API Handlers (`api/`)
* `api/auth.js`: Node.js BetterAuth handler using `toNodeHandler(auth)`.
* `api/calculate-distance.js`: Distance matrix API with Drummondville origin.
* `api/create-payment-intent.js`: Stripe payment intent handler.

## 3. Environment Variables
* `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BETTER_AUTH_API_KEY`, `STRIPE_SECRET_KEY`.
