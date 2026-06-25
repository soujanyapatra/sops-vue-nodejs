const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  
  const getVal = (key) => {
    // Matches both "KEY: VALUE" (YAML) and "KEY=VALUE" (dotenv)
    const match = content.match(new RegExp('^' + key + '\\s*[:=]\\s*(.*)', 'm'));
    return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
  };

  const keys = ['NEWS_API_AI_KEY', 'API_KEY', 'ENVIRONMENT'];
  let envData = '';
  
  for (const key of keys) {
    const val = getVal(key);
    if (!val) {
      console.error(`Error: Key "${key}" not found or empty in decrypted file`);
      process.exit(1);
    }
    envData += `${key}=${val}\n`;
  }

  if (process.env.GITHUB_ENV) {
    fs.appendFileSync(process.env.GITHUB_ENV, envData);
    console.log('Successfully exported variables to GITHUB_ENV.');
  } else {
    // If run locally, write to a new .env file in standard dotenv format
    const dotenvPath = path.join(process.cwd(), '.env.decrypted');
    fs.writeFileSync(dotenvPath, envData);
    console.log(`Successfully wrote standard dotenv configuration to: .env.decrypted`);
  }
} catch (error) {
  console.error('Failed to parse environment variables:', error.message);
  process.exit(1);
}
