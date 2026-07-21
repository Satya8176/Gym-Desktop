import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

//============================================ Add Body Part ========================================================//

async function addBodyPart(req, res) {
    const { name, description } = req.body;

    // Validation
    if (!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Body part name is required"
        });
    }

    try {
        // Check if body part already exists
        const existingBodyPart = await prisma.bodyPart.findFirst({
            where: {
                name: name.trim()
            }
        });

        if (existingBodyPart) {
            return res.status(400).json({
                success: false,
                message: "Body part already exists"
            });
        }

        // Create body part
        const bodyPart = await prisma.bodyPart.create({
            data: {
                name: name.trim(),
                description: description || ""
            }
        });

        return res.status(201).json({
            success: true,
            message: "Body part added successfully",
            data: bodyPart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//============================================ Get All Body Parts ========================================================//

async function getAllBodyParts(req, res) {
    try {
        const bodyParts = await prisma.bodyPart.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        if (bodyParts.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No body parts found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Body parts retrieved successfully",
            data: bodyParts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//============================================ Get Body Part by ID ========================================================//

async function getBodyPartById(req, res) {
    const { bodyPartId } = req.params;

    if (!bodyPartId) {
        return res.status(400).json({
            success: false,
            message: "Body part ID is required"
        });
    }

    try {
        const bodyPart = await prisma.bodyPart.findUnique({
            where: { id: parseInt(bodyPartId) }
        });

        if (!bodyPart) {
            return res.status(404).json({
                success: false,
                message: "Body part not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Body part retrieved successfully",
            data: bodyPart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//============================================ Update Body Part ========================================================//

async function updateBodyPart(req, res) {
    const { bodyPartId } = req.params;
    const { name, description } = req.body;

    if (!bodyPartId) {
        return res.status(400).json({
            success: false,
            message: "Body part ID is required"
        });
    }

    if (!name && !description) {
        return res.status(400).json({
            success: false,
            message: "At least one field (name or description) is required to update"
        });
    }

    try {
        const existingBodyPart = await prisma.bodyPart.findUnique({
            where: { id: parseInt(bodyPartId) }
        });

        if (!existingBodyPart) {
            return res.status(404).json({
                success: false,
                message: "Body part not found"
            });
        }

        const updatedBodyPart = await prisma.bodyPart.update({
            where: { id: parseInt(bodyPartId) },
            data: {
                name: name ? name.trim() : existingBodyPart.name,
                description: description !== undefined ? description : existingBodyPart.description
            }
        });

        return res.status(200).json({
            success: true,
            message: "Body part updated successfully",
            data: updatedBodyPart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//============================================ Delete Body Part ========================================================//

async function deleteBodyPart(req, res) {
    const { bodyPartId } = req.params;

    if (!bodyPartId) {
        return res.status(400).json({
            success: false,
            message: "Body part ID is required"
        });
    }

    try {
        const existingBodyPart = await prisma.bodyPart.findUnique({
            where: { id: parseInt(bodyPartId) }
        });

        if (!existingBodyPart) {
            return res.status(404).json({
                success: false,
                message: "Body part not found"
            });
        }

        await prisma.bodyPart.delete({
            where: { id: parseInt(bodyPartId) }
        });

        return res.status(200).json({
            success: true,
            message: "Body part deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export { addBodyPart, getAllBodyParts, getBodyPartById, updateBodyPart, deleteBodyPart };
