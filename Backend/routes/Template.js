import express from "express";
import { createTemplate, getAllTemplates, getTemplateById, getTemplatesByDifficulty, updateTemplate, deleteTemplate } from "../Controllers/Template.js";

const templateRouter = express.Router();

// Create a new template
templateRouter.post("/create-template", createTemplate);

// Get all templates
templateRouter.get("/get-all-templates", getAllTemplates);

// Get template by ID
templateRouter.get("/get-template/:templateId", getTemplateById);

// Get templates by difficulty level
templateRouter.get("/get-templates-by-difficulty/:difficulty", getTemplatesByDifficulty);

// Update template
templateRouter.put("/update-template/:templateId", updateTemplate);

// Delete template
templateRouter.delete("/delete-template/:templateId", deleteTemplate);

export default templateRouter;
