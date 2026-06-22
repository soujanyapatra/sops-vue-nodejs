import dotenv from 'dotenv';
import path from 'path';

// Load environment variables. We try both the backend folder .env and the root directory .env.
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
