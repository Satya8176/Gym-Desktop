import express from "express"  

import { getLatestRoutine, getAllRoutine, isRoutine, getAllMemRoutine } from "../Controllers/GetWorkout.js"

const getWorkoutRouter = express.Router();

getWorkoutRouter.post("/get-latest-routine", getLatestRoutine);
getWorkoutRouter.post("/get-all-routines",  getAllRoutine);
getWorkoutRouter.get("/is-routine", isRoutine);
getWorkoutRouter.get("/all-mem-routine",getAllMemRoutine)

export default getWorkoutRouter;