import { auth } from "../lib/auth";

export default async function handler(req, res) {
  // Pass standard Node / Vercel request to Better Auth
  return auth.handler(req, res);
}
