import express from "express";
import { addBodyPart, getAllBodyParts, getBodyPartById, updateBodyPart, deleteBodyPart } from "../Controllers/BodyPart.js";

const bodyPartRouter = express.Router();

// Add a new body part
bodyPartRouter.post("/add-body-part", addBodyPart);

// Get all body parts
bodyPartRouter.get("/get-all-body-parts", getAllBodyParts);

// Get body part by ID
bodyPartRouter.get("/get-body-part/:bodyPartId", getBodyPartById);

// Update body part
bodyPartRouter.put("/update-body-part/:bodyPartId", updateBodyPart);

// Delete body part
bodyPartRouter.delete("/delete-body-part/:bodyPartId", deleteBodyPart);

export default bodyPartRouter;
