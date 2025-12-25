import express from "express";

import {createExercise, createUserSplit, createRoutine, createWorkout,getAllExercise} from "../Controllers/Workout.js";

const workoutRouter = express.Router();


workoutRouter.post("/create-exercise", createExercise);
workoutRouter.post("/create-userSplit", createUserSplit);
workoutRouter.post("/create-routine", createRoutine);
workoutRouter.post("/create-workout", createWorkout);
workoutRouter.get("/get-all-exercise", getAllExercise);


export default workoutRouter;
