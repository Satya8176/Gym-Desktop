import express from "express";
import { addEquipment, getAllEquipment, getEquipmentById, updateEquipment, deleteEquipment } from "../Controllers/Equipment.js";

const equipmentRouter = express.Router();

// Add a new equipment
equipmentRouter.post("/add-equipment", addEquipment);

// Get all equipment
equipmentRouter.get("/get-all-equipment", getAllEquipment);

// Get equipment by ID
equipmentRouter.get("/get-equipment/:equipmentId", getEquipmentById);

// Update equipment
equipmentRouter.put("/update-equipment/:equipmentId", updateEquipment);

// Delete equipment
equipmentRouter.delete("/delete-equipment/:equipmentId", deleteEquipment);

export default equipmentRouter;
