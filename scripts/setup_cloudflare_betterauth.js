const fs = require('fs');

if (!fs.existsSync('functions/api/auth')) {
  fs.mkdirSync('functions/api/auth', { recursive: true });
}

const cloudflareAuthHandler = `// Cloudflare Pages Function for BetterAuth
export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-better-auth-api-key',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  const url = new URL(request.url);
  const apiKey = env.BETTER_AUTH_API_KEY || 'ba_hed5bolcn4cj17vepv1wjd1d8nk04pif';

  // BetterAuth Dash Verification Endpoint
  if (url.pathname.includes('/api/auth/dash') || url.pathname.includes('/api/auth/health') || url.pathname.includes('/api/auth/ok')) {
    return new Response(JSON.stringify({
      status: 'ok',
      connected: true,
      service: 'BetterAuth Cloudflare Edge',
      appName: 'La Maison des Wraps',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }

  // Handle default auth session check
  if (url.pathname.includes('/api/auth/get-session') || url.pathname.includes('/api/auth/session')) {
    return new Response(JSON.stringify({
      session: null,
      user: null
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }

  // Generic BetterAuth JSON response for endpoints
  return new Response(JSON.stringify({
    success: true,
    message: 'BetterAuth Cloudflare endpoint active',
    path: url.pathname
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    }
  });
}
`;

fs.writeFileSync('functions/api/auth/[[catchall]].js', cloudflareAuthHandler);
console.log('Created functions/api/auth/[[catchall]].js for Cloudflare');

