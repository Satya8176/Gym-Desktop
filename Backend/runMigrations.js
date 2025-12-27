import { execSync } from "child_process";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export function runMigrations() {
  try {
    // console.log("Running Prisma migrations…");

    execSync("npm run migrate:deploy", {
      cwd: __dirname,
      stdio: "inherit"
    });

    // console.log("Migrations complete.");
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  }
}
