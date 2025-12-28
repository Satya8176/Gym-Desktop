const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");
const cp = require("child_process");
const fs = require("fs");

// ✅ CRITICAL: Single instance lock - prevents multiple app instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// State variables
let mainWindow;
let backendServer;

// Set environment
if (!app.isPackaged) {
  process.env.ELECTRON_IS_DEV = "true";
}

/**
 * Starts the backend server in development mode
 */
async function startBackendDev() {
  try {
    const { runMigrations } = await import("../Backend/runMigrations.js");
    
    // Run migrations first
    console.log("Running database migrations...");
    await runMigrations();
    
    // Load and start backend server
    const { default: serverApp } = await import("../Backend/server.js");
    
    backendServer = http.createServer(serverApp);
    
    return new Promise((resolve, reject) => {
      const server = backendServer.listen(4000, () => {
        console.log("✅ Backend running on http://localhost:4000");
        resolve();
      });
      
      server.on("error", (err) => {
        console.error("❌ Backend startup error:", err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start backend:", error);
    throw error;
  }
}

/**
 * Starts the backend server in production mode
 */
async function startBackendProduction() {
  try {
    // Load backend server
    const { default: serverApp } = await import("../Backend/server.js");

    // -------- DB BOOTSTRAP LOGIC --------
    const userDataPath = app.getPath("userData");
    const userDbPath = path.join(userDataPath, "database.db");

    const templateDbPath = path.join(
      __dirname,
      "../Backend/template/database.db"
    );

    // First install → copy DB
    if (!fs.existsSync(userDbPath)) {
      console.log("First run detected — creating database...");
      fs.copyFileSync(templateDbPath, userDbPath);
      console.log("Database created at:", userDbPath);
    } else {
      console.log("Existing database found:", userDbPath);
    }
    // ------------------------------------

    backendServer = http.createServer(serverApp);

    return new Promise((resolve, reject) => {
      const server = backendServer.listen(4000, () => {
        console.log("✅ Backend running on http://localhost:4000 (packaged)");
        resolve();
      });

      server.on("error", (err) => {
        console.error("❌ Backend startup error:", err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start backend:", error);
    throw error;
  }
}


/**
 * Creates the main application window
 */
function createWindow() {
  if (mainWindow) {
    // Prevent duplicate windows
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
  });

  const indexPath = path.join(__dirname, "../Frontend/dist/index.html");
  
  mainWindow.loadFile(indexPath).catch((err) => {
    console.error("Failed to load index.html:", err);
    // Fallback: load from dev server if dist doesn't exist
    mainWindow.loadURL("http://localhost:5173");
  });

  // Open dev tools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 * Cleanup and quit
 */
let quitting = false;

function cleanupAndQuit() {
  if (quitting) return;
  quitting = true;

  if (backendServer) {
    backendServer.close();
    backendServer = null;
  }

  // Do NOT call app.quit() here
}

// ✅ App initialization
app.whenReady().then(async () => {
  try {
    // Start backend
    if (app.isPackaged) {
      await startBackendProduction();
    } else {
      await startBackendDev();
    }
    
    // Create main window
    createWindow();
  } catch (error) {
    console.error("Failed to initialize app:", error);
    cleanupAndQuit();
  }
});

// ✅ Handle window-all-closed
app.on("window-all-closed", () => {
  // On macOS, apps stay active until user quits explicitly
  if (process.platform !== "darwin") {
    cleanupAndQuit();
    app.quit();
  }
});

// ✅ Handle app activation (macOS & Windows)
app.on("activate", () => {
  // On macOS, re-create window when dock icon is clicked
  // On Windows, this also handles taskbar click
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.focus();
  }
});

// ✅ Handle second instance attempt
app.on("second-instance", () => {
  // If user tries to launch the app again, focus the existing window
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  } else {
    createWindow();
  }
});

// ✅ Cleanup on quit
app.on("before-quit", () => {
  cleanupAndQuit();
});
