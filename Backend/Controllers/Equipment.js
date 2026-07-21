import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

//============================================ Add Equipment ========================================================//

async function addEquipment(req, res) {
    const { name, description } = req.body;

    // Validation
    if (!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Equipment name is required"
        });
    }

    try {
        // Check if equipment already exists
        const existingEquipment = await prisma.equipment.findFirst({
            where: {
                name: name.trim()
            }
        });

        if (existingEquipment) {
            return res.status(400).json({
                success: false,
                message: "Equipment already exists"
            });
        }

        // Create equipment
        const equipment = await prisma.equipment.create({
            data: {
                name: name.trim(),
                description: description || ""
            }
        });

        return res.status(201).json({
            success: true,
            message: "Equipment added successfully",
            data: equipment
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

//============================================ Get All Equipment ========================================================//

async function getAllEquipment(req, res) {
    try {
        const equipment = await prisma.equipment.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        if (equipment.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No equipment found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Equipment retrieved successfully",
            data: equipment
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

//============================================ Get Equipment by ID ========================================================//

async function getEquipmentById(req, res) {
    const { equipmentId } = req.params;

    if (!equipmentId) {
        return res.status(400).json({
            success: false,
            message: "Equipment ID is required"
        });
    }

    try {
        const equipment = await prisma.equipment.findUnique({
            where: { id: parseInt(equipmentId) }
        });

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Equipment retrieved successfully",
            data: equipment
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

//============================================ Update Equipment ========================================================//

async function updateEquipment(req, res) {
    const { equipmentId } = req.params;
    const { name, description } = req.body;

    if (!equipmentId) {
        return res.status(400).json({
            success: false,
            message: "Equipment ID is required"
        });
    }

    if (!name && !description) {
        return res.status(400).json({
            success: false,
            message: "At least one field (name or description) is required to update"
        });
    }

    try {
        const existingEquipment = await prisma.equipment.findUnique({
            where: { id: parseInt(equipmentId) }
        });

        if (!existingEquipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        const updatedEquipment = await prisma.equipment.update({
            where: { id: parseInt(equipmentId) },
            data: {
                name: name ? name.trim() : existingEquipment.name,
                description: description !== undefined ? description : existingEquipment.description
            }
        });

        return res.status(200).json({
            success: true,
            message: "Equipment updated successfully",
            data: updatedEquipment
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

//============================================ Delete Equipment ========================================================//

async function deleteEquipment(req, res) {
    const { equipmentId } = req.params;

    if (!equipmentId) {
        return res.status(400).json({
            success: false,
            message: "Equipment ID is required"
        });
    }

    try {
        const existingEquipment = await prisma.equipment.findUnique({
            where: { id: parseInt(equipmentId) }
        });

        if (!existingEquipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        await prisma.equipment.delete({
            where: { id: parseInt(equipmentId) }
        });

        return res.status(200).json({
            success: true,
            message: "Equipment deleted successfully"
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

export { addEquipment, getAllEquipment, getEquipmentById, updateEquipment, deleteEquipment };
