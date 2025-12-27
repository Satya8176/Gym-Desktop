import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbFilePath;

// detect production electron
const isElectron =
  !!process.versions.electron && process.env.ELECTRON_IS_DEV !== "true";

if (isElectron) {
  // lazy import electron in ESM
  const electron = await import("electron");
  const userDataPath = electron.app.getPath("userData");

  dbFilePath = path.join(userDataPath, "database.db");
} else {
  // dev mode — prisma/dev.db
  dbFilePath = path.join(__dirname, "prisma", "dev.db");
}

// prisma ENV must be set BEFORE client init
process.env.DATABASE_URL = `file:${dbFilePath}`;

// console.log("DB file path:", process.env.DATABASE_URL);

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default prisma;
