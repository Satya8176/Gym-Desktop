import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', 'gym.db');
process.env.DATABASE_URL = `file:${dbPath}`;
console.log('listOwners using DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  try {
    const owners = await prisma.owner.findMany();
    console.log('OWNERS:', JSON.stringify(owners, null, 2));
  } catch (err) {
    console.error('ERROR while querying owners:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();

// script to list all owners in the database, used for debugging purposes 
// script can be run with `npm run list-owners`
// node scripts/listOwners.js
