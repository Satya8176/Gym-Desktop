import 'dotenv/config';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', 'gym.db');
process.env.DATABASE_URL = `file:${dbPath}`;
console.log('createDevOwner using DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const ask = (query, hide = false) => {
  return new Promise((resolve) => {
    if (!hide) {
      rl.question(query, (answer) => resolve(answer.trim()));
      return;
    }

    const stdin = process.stdin;
    const onData = (char) => {
      const key = String(char);
      if (key === '\r' || key === '\n') {
        stdin.pause();
        rl.output.write('\n');
        stdin.removeListener('data', onData);
      } else if (key === '\u0003') {
        process.exit();
      } else {
        rl.output.write('*');
      }
    };

    rl.question(query, (answer) => {
      resolve(answer.trim());
    });

    stdin.on('data', onData);
  });
};

const main = async () => {
  try {
    const args = process.argv.slice(2);
    const userName = args[0] || await ask('Dev username: ');
    const password = args[1] || await ask('Dev password: ', true);

    if (!userName || !password) {
      console.error('Username and password are required.');
      process.exit(1);
    }

    const existingDev = await prisma.owner.findFirst({ where: { isDev: true } });
    if (existingDev) {
      console.error('A developer owner already exists. Only one developer credential is allowed.');
      process.exit(1);
    }

    const existing = await prisma.owner.findUnique({ where: { userName } });
    if (existing) {
      console.error(`Owner already exists for username "${userName}".`);
      process.exit(1);
    }

    const hashed = await bcrypt.hash(password, 10);
    const owner = await prisma.owner.create({
      data: {
        userName,
        password: hashed,
        isDev: true,
        devSecret: 'DEVELOPER_ACCOUNT',
      },
    });

    console.log(`Dev owner created successfully (id: ${owner.id}).`);
  } catch (error) {
    console.error('Error creating dev owner:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
};

main();
