import { createAuthClient } from "better-auth/client";
import { sentinelClient } from "@better-auth/infra/client";

const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "https://la-maison-des-wrap-app.btrade099.workers.dev";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    sentinelClient(),
  ],
});

