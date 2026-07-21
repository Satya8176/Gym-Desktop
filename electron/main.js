const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");

let mainWindow;
let backendServer;

/* -------------------------------------------------------
   START BACKEND (DEV)
------------------------------------------------------- */

async function startBackendDev() {
  try {

    const { default: serverApp } = await import("../Backend/server.js");

    backendServer = http.createServer(serverApp);

    return new Promise((resolve, reject) => {

      const server = backendServer.listen(4000, () => {
        console.log("✅ Backend running on http://localhost:4000");
        resolve();
      });

      server.on("error", reject);

    });

  } catch (error) {
    console.error("❌ Backend startup error:", error);
    throw error;
  }
}

/* -------------------------------------------------------
   START BACKEND (PRODUCTION)
------------------------------------------------------- */

async function startBackendProduction() {

  try {

    /* ---------------------------------------------------
       DATABASE PATHS
    --------------------------------------------------- */

    const userDataPath = app.getPath("userData");

    const userDbPath = path.join(userDataPath, "gym.db");

    const templateDbPath = path.join(
      process.resourcesPath,
      "app",
      "Backend",
      "gym.db"
    );

    /* ---------------------------------------------------
       FIRST INSTALL DATABASE COPY
    --------------------------------------------------- */

    if (!fs.existsSync(userDbPath)) {

      console.log("📦 First run detected → copying database");

      fs.copyFileSync(templateDbPath, userDbPath);

    }

    /* ---------------------------------------------------
       SET DATABASE URL BEFORE IMPORTING BACKEND
    --------------------------------------------------- */

    process.env.DATABASE_URL = `file:${userDbPath}`;

    console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

    /* ---------------------------------------------------
       IMPORT BACKEND AFTER DATABASE_URL
    --------------------------------------------------- */

    const backendPath = path.join(
      process.resourcesPath,
      "app",
      "Backend",
      "server.js"
    );

    const { default: serverApp } =
      await import(`file://${backendPath}`);

    /* ---------------------------------------------------
       START SERVER
    --------------------------------------------------- */

    backendServer = http.createServer(serverApp);

    return new Promise((resolve, reject) => {

      const server = backendServer.listen(4000, () => {

        console.log("✅ Backend running on http://localhost:4000");

        resolve();

      });

      server.on("error", reject);

    });

  } catch (error) {

    console.error("❌ Backend startup error:", error);

    throw error;

  }

}
/* -------------------------------------------------------
   CREATE WINDOW
------------------------------------------------------- */

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      devTools: !app.isPackaged
    }
  });

  if (app.isPackaged) {
    Menu.setApplicationMenu(null);
    mainWindow.webContents.on("devtools-opened", (event) => {
      event.preventDefault();
      mainWindow.webContents.closeDevTools();
    });
  }

  if (!app.isPackaged) {

    mainWindow.loadURL("http://localhost:5173");

  } else {

    const indexPath = path.join(
      process.resourcesPath,
      "app",
      "Frontend",
      "dist",
      "index.html"
    );

    mainWindow.loadFile(indexPath);

  }

}

/* -------------------------------------------------------
   APP START
------------------------------------------------------- */

app.whenReady().then(async () => {

  try {

    if (app.isPackaged) {
      await startBackendProduction();
    } else {
      // await startBackendDev(); // <-- DEV MODE: START BACKEND SEPARATELY
    }

    createWindow();

  } catch (error) {

    console.error("App failed to start:", error);
    app.quit();

  }

});

/* -------------------------------------------------------
   CLEANUP
------------------------------------------------------- */

app.on("window-all-closed", () => {

  if (backendServer) {
    backendServer.close();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }

});