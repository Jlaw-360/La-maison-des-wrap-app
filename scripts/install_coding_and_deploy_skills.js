const fs = require('fs');
const path = require('path');

console.log("Installing coding and dual-deployment skills (Cloudflare & Vercel)...");

function ensureSkill(name, content) {
  const dir = path.join('.agents', 'skills', name);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'SKILL.md'), content);
  console.log(`✓ Installed skill: ${name}`);
}

// 1. Fullstack Coding Engineer Skill
const fullstackCodingSkill = `---
name: fullstack-coding-engineer
description: Expert coding skill for building robust, scalable restaurant applications across React Native (Mobile iOS/Android), Web (PWA), and Node/Edge Backends with Supabase and Stripe.
---

# Fullstack Coding Engineer for Restaurant Systems

## 1. Clean Architecture & Code Standards
* **Cross-Platform Parity**: Ensure identical business logic, data models, and calculations across Web (\`index.html\`, \`src/\`) and Mobile (\`mobile/src/\`).
* **Strict Typing & Error Handling**:
  * Type-safe interfaces for Menu Items, Orders, Order Items, Customers, and GPS tracking.
  * Graceful fallback mechanisms for network drops, offline caching, and missing camera permissions.
* **Reactive State Management**:
  * Cart Context: Instant subtotal, Quebec taxes (TPS 5%, TVQ 9.975%), dynamic delivery fee, and discount calculations.
  * Auth Context: Supabase & BetterAuth session persistence with local storage sync.
  * Realtime Context: Live WebSocket listening on Supabase \`orders\` and \`order_chats\` tables.

## 2. API Integration Standards
* **Supabase Client (\`@supabase/supabase-js\`)**:
  * Centralized initialization with URL and anon key.
  * Direct table CRUD and realtime subscriptions (\`supabase.channel('public:orders')\`).
* **Stripe Payment Elements**:
  * Serverless payment intent creation with currency conversion (\`amount * 100\`).
  * Direct client confirmation via Stripe.js and \`@stripe/stripe-react-native\`.
* **Google Maps Distance Matrix**:
  * Precision distance measurement from restaurant origin (\`998 110e Avenue, Drummondville\`) with mileage tiers.
`;

ensureSkill('fullstack-coding-engineer', fullstackCodingSkill);

// 2. Cloudflare Deployment Skill
const cloudflareDeploySkill = `---
name: cloudflare-deployment
description: Guide and best practices for deploying static assets, React Native Web, and Edge Functions on Cloudflare Pages and Cloudflare Workers with zero downtime and unlimited bandwidth.
---

# Cloudflare Deployment Engine

## 1. Project Configuration (\`wrangler.toml\`)
\`\`\`toml
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
\`\`\`

## 2. Edge Routing & Functions (\`functions/api/\`)
* \`_redirects\`: Clean SPA routing for \`/kitchen\`, \`/driver\`, \`/admin\`, \`/order\`.
* \`_headers\`: Security headers, CORS preflight (\`OPTIONS 204\`), and cache-control.
* \`functions/api/auth/[[catchall]].js\`: BetterAuth Edge handler.
* \`functions/api/calculate-distance.js\`: Real-time delivery fee calculation.
* \`functions/api/create-payment-intent.js\`: Stripe payment processing.

## 3. Deployment Workflow
* Direct Git integration: Automatic deployment on push to \`main\`.
* CLI Deployment: \`npx wrangler pages deploy . --project-name=la-maison-des-wrap-app\`.
`;

ensureSkill('cloudflare-deployment', cloudflareDeploySkill);

// 3. Vercel Deployment Skill
const vercelDeploySkill = `---
name: vercel-deployment
description: Guide and best practices for deploying high-performance serverless web applications and API routes on Vercel.
---

# Vercel Deployment Engine

## 1. Configuration (\`vercel.json\`)
\`\`\`json
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
\`\`\`

## 2. Serverless API Handlers (\`api/\`)
* \`api/auth.js\`: Node.js BetterAuth handler using \`toNodeHandler(auth)\`.
* \`api/calculate-distance.js\`: Distance matrix API with Drummondville origin.
* \`api/create-payment-intent.js\`: Stripe payment intent handler.

## 3. Environment Variables
* \`NEXT_PUBLIC_SUPABASE_URL\`, \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\`, \`BETTER_AUTH_API_KEY\`, \`STRIPE_SECRET_KEY\`.
`;

ensureSkill('vercel-deployment', vercelDeploySkill);

console.log("All coding and deployment skills installed successfully!");

