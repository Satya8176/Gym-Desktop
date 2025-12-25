import express from "express";
const app = express();
const PORT = 4000;
import cors from "cors";
import fileUpload from "express-fileupload";

// router import
import userRouter from "./routes/User.js";
import  workoutRouter from "./routes/Workout.js";
import getWorkoutRouter from "./routes/GetWorkout.js";
import ownerRouter from "./routes/ownerRoute.js";
import testRouter from "./routes/Test.js";


app.use(cors({
  origin: [
    'http://localhost:5173',          // your local frontend
    /\.ngrok-free\.app$/              // ✅ allow all ngrok subdomains
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true                  // allow cookies/auth headers if needed
}));
app.use(express.json());
//  =================================================== Home Route ===================================================//

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



app.listen(PORT, () => {
    console.log("App is listening on port: ", PORT);
})