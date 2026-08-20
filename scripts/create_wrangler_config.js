const fs = require('fs');

const wranglerToml = `name = "la-maison-des-wraps"
account_id = "c67bc5032024bb38d910f5a0723fc3fa"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."
`;

fs.writeFileSync('wrangler.toml', wranglerToml);
console.log('Created wrangler.toml');

// Append CLOUDFLARE_ACCOUNT_ID to .env
if (fs.existsSync('.env')) {
  let env = fs.readFileSync('.env', 'utf8');
  if (!env.includes('CLOUDFLARE_ACCOUNT_ID')) {
    env += '\nCLOUDFLARE_ACCOUNT_ID=c67bc5032024bb38d910f5a0723fc3fa\n';
    fs.writeFileSync('.env', env);
    console.log('Updated .env with CLOUDFLARE_ACCOUNT_ID');
  }
}
