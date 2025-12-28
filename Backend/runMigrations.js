import { execSync } from "child_process";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export function runMigrations() {
  try {
    console.log("Running prisma migrate deploy...");

    const prismaPath = path.join(
      __dirname,
      "node_modules",
      ".bin",
      process.platform === "win32" ? "prisma.cmd" : "prisma"
    );

    execSync(
      `"${prismaPath}" migrate deploy --schema=./prisma/schema.prisma`,
      {
        cwd: __dirname,
        stdio: "pipe",
        env: { ...process.env }
      }
    );

    console.log("Migrations complete.");
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  }
}
