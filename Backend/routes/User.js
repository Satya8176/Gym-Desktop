import express from "express";
import { createUser, getAllUsers, getSingleUser, updateMemberDetail, deleteUser } from "../Controllers/User.js";


const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.get("/getUsers", getAllUsers );
userRouter.post("/get-single-user",getSingleUser)
userRouter.post("/update-User-Detail",updateMemberDetail)
userRouter.post("/delete-user", deleteUser)

export default userRouter;