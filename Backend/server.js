import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import userRouter from "./routes/User.js";
import workoutRouter from "./routes/Workout.js";
import getWorkoutRouter from "./routes/GetWorkout.js";
import ownerRouter from "./routes/ownerRoute.js";
import testRouter from "./routes/Test.js";

const app = express();

// ---------- CORS ----------
app.use(
  cors({
    origin: "*",   // Electron app is same-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ---------- BODY PARSING ----------
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


app.get("/", (req, res) => {
  res.send("API Working");
});

// ---------- ROUTES ----------
app.use("/api/owner", ownerRouter);
app.use("/api/user", userRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/getWorkout", getWorkoutRouter);
app.use("/api/test", testRouter);

// ---------- ⛔ DO NOT LISTEN HERE ----------
export default app;
