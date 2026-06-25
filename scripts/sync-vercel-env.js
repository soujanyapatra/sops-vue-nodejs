const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found');
    process.exit(1);
  }

  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    console.error('VERCEL_TOKEN environment variable is required');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  
  // Regex to match "KEY: VALUE" or "KEY=VALUE"
  const regex = /^([A-Za-z0-9_-]+)\s*[:=]\s*(.*)/gm;
  let match;
  let count = 0;

  while ((match = regex.exec(content)) !== null) {
    const key = match[1].trim();
    let val = match[2].trim().replace(/^['"]|['"]$/g, '');

    // Skip any SOPS metadata keys if present in case of raw YAML decryption
    if (key.startsWith('sops') || key === 'lastmodified' || key === 'mac' || key === 'version' || key === 'enc') {
      continue;
    }

    console.log(`Syncing ${key} to Vercel...`);
    try {
      execSync(`npx vercel env add ${key} production --value "${val.replace(/"/g, '\\"')}" --force --yes --token=${vercelToken}`, {
        stdio: 'ignore'
      });
      count++;
    } catch (cmdError) {
      console.error(`Failed to sync variable ${key}`);
      process.exit(1);
    }
  }

  console.log(`Successfully synced ${count} environment variables to Vercel.`);
} catch (error) {
  console.error('Failed to sync environment variables to Vercel:', error.message);
  process.exit(1);
}
