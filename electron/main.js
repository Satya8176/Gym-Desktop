const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });
  win.webContents.openDevTools(); 
  const indexPath = path.join(
    __dirname,
    "../Frontend/dist/index.html"
  );

  console.log("Loading:", indexPath);

  win.loadFile(indexPath);
}

app.whenReady().then(() => {
  backendProcess = spawn(
    "node",
    ["server.js"],
    {
      cwd: path.join(__dirname, "../Backend"),
    }
  );

  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  app.quit();
});
