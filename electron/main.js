const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");

async function startBackend() {

  // 1️⃣ Ensure DB path + env are set FIRST
  if (!app.isPackaged) {
    process.env.ELECTRON_IS_DEV = "true";
  }

  const { runMigrations } = await import("../Backend/runMigrations.js");

  // 2️⃣ Run migrations
  await runMigrations();

  // 3️⃣ Load backend after schema is correct
  const { default: serverApp } = await import("../Backend/server.js");

  const backendServer = http.createServer(serverApp);

  return new Promise(resolve => {
    backendServer.listen(3000, () => {
      console.log("Backend running on 3000");
      resolve(backendServer);
    });
  });
}

let mainWindow;
let backendServer;

if (!app.isPackaged) {
  process.env.ELECTRON_IS_DEV = "true";
}


async function startBackend() {
  const { default: serverApp } = await import("../Backend/server.js");

  backendServer = http.createServer(serverApp);

  return new Promise(resolve => {
    backendServer.listen(4000, () => {
      console.log("Backend running on 4000");
      resolve();
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  });

  const indexPath = path.join(__dirname, "../Frontend/dist/index.html");
  mainWindow.loadFile(indexPath);

  // if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  // }
}

app.whenReady().then(async () => {
  await startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendServer) backendServer.close();
  app.quit();
});
