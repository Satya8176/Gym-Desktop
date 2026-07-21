import 'dotenv/config';
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const app = express();
const PORT = 4000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Location where client data should live
const appDataFolder = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "Gym Management System"
);

if(!fs.existsSync(appDataFolder)) {
  fs.mkdirSync(appDataFolder, { recursive: true });
}

// Default DB shipped with app
const defaultDb = path.join(__dirname, "gym.db");

// Resolve the database path from DATABASE_URL and fallback to the repo gym.db.
const resolveDbUrl = (url) => {
  if (!url) return `file:${defaultDb}`;
  if (url.startsWith("file:")) url = url.slice(5);
  const absolutePath = path.isAbsolute(url) ? url : path.resolve(__dirname, url);
  return `file:${absolutePath}`;
};

process.env.DATABASE_URL = resolveDbUrl(process.env.DATABASE_URL);
console.log("Using DATABASE_URL:", process.env.DATABASE_URL);




/* =====================================================
   ROUTES IMPORT
   ===================================================== */
import userRouter from "./routes/User.js";
import  workoutRouter from "./routes/Workout.js";
import getWorkoutRouter from "./routes/GetWorkout.js";
import ownerRouter from "./routes/ownerRoute.js";
import testRouter from "./routes/Test.js";
import templateRouter from "./routes/Template.js";
import bodyPartRouter from "./routes/BodyPart.js";
import equipmentRouter from "./routes/Equipment.js";


/* =====================================================
   MIDDLEWARE
   ===================================================== */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /\.ngrok-free\.app$/
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());

app.use(
  fileUpload(
    {
      useTempFiles: true,
      tempFileDir: "/tmp/",
    }
  )
)

app.get("/" , (req,res) => {

    res.send("APT Working");
})




//  =================================================== Routes ===================================================//
app.use("/api/owner",ownerRouter);

app.use("/api/user", userRouter);

app.use("/api/workout", workoutRouter);

app.use("/api/getWorkout",getWorkoutRouter );

app.use("/api/test",testRouter);

app.use("/api/template", templateRouter);

app.use("/api/bodypart", bodyPartRouter);

app.use("/api/equipment", equipmentRouter);


/* =====================================================
   START SERVER
   ===================================================== */

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  });
}


export default app;