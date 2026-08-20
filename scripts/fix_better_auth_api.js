const fs = require('fs');
const path = require('path');

const handlerCode = `import { auth } from "../lib/auth";
import { toNodeHandler } from "better-auth/node";

const authHandler = toNodeHandler(auth);

export default async function handler(req, res) {
  // Normalize double slashes in URL if sent by dash
  if (req.url && req.url.startsWith('//')) {
    req.url = req.url.replace(/^\\/\\//, '/');
  }

  // Enable CORS headers for Better Auth Dash & Client
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Better-Auth-Api-Key"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return authHandler(req, res);
}
`;

fs.writeFileSync('api/auth.js', handlerCode);

if (!fs.existsSync('api/auth')) {
  fs.mkdirSync('api/auth', { recursive: true });
}
fs.writeFileSync('api/auth/[...all].js', handlerCode.replace('../lib/auth', '../../lib/auth'));

console.log('Created api/auth.js and api/auth/[...all].js');

// Update vercel.json
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
vercelConfig.rewrites = [
  { "source": "/api/auth/:path*", "destination": "/api/auth.js" },
  { "source": "/api/auth", "destination": "/api/auth.js" },
  { "source": "/api/(.*)", "destination": "/api/$1" },
  { "source": "/kitchen", "destination": "/kitchen.html" },
  { "source": "/driver", "destination": "/driver.html" },
  { "source": "/delivery", "destination": "/driver.html" },
  { "source": "/admin", "destination": "/admin.html" },
  { "source": "/order", "destination": "/index.html" }
];
fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('Updated vercel.json with auth routes');
