import { auth } from "../../lib/auth";
import { toNodeHandler } from "better-auth/node";

const authHandler = toNodeHandler(auth);

export default async function handler(req, res) {
  // Normalize double slashes in URL if sent by dash
  if (req.url && req.url.startsWith('//')) {
    req.url = req.url.replace(/^\/\//, '/');
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
