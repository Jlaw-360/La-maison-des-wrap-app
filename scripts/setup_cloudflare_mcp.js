const fs = require('fs');
const path = require('path');

const cloudflareServers = {
  "cloudflare": { "url": "https://mcp.cloudflare.com/mcp" },
  "cloudflare-docs": { "url": "https://docs.mcp.cloudflare.com/mcp" },
  "cloudflare-bindings": { "url": "https://bindings.mcp.cloudflare.com/mcp" },
  "cloudflare-builds": { "url": "https://builds.mcp.cloudflare.com/mcp" },
  "cloudflare-observability": { "url": "https://observability.mcp.cloudflare.com/mcp" }
};

function updateMcpFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let config = { mcpServers: {} };
  if (fs.existsSync(filePath)) {
    try {
      config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!config.mcpServers) config.mcpServers = {};
    } catch(e) {
      config = { mcpServers: {} };
    }
  }

  Object.assign(config.mcpServers, cloudflareServers);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
  console.log(`Updated ${filePath}`);
}

updateMcpFile('.vscode/mcp.json');
updateMcpFile('.cursor/mcp.json');
updateMcpFile('.mcp.json');

