import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

//============================================ Create Template ========================================================//
async function createTemplate(req, res) {
  const { name, description, templateDays } = req.body;

  if (!name || !description || !templateDays) {
    return res.status(400).json({
      success: false,
      message: "name, description and templateDays are required"
    });
  }

  // Parse JSON (same as routine)
  let parsedTemplateDays;
  try {
    parsedTemplateDays =
      typeof templateDays === "string"
        ? JSON.parse(templateDays)
        : templateDays;
  } catch {
    return res.status(400).json({
      success: false,
      message: "templateDays must be valid JSON"
    });
  }

  if (!Array.isArray(parsedTemplateDays) || parsedTemplateDays.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one day is required"
    });
  }

  try {
    // Check duplicate
    const existingTemplate = await prisma.template.findFirst({
      where: { name }
    });

    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: "Template already exists"
      });
    }

    // CREATE TEMPLATE (SAME STRUCTURE AS ROUTINE)
    const template = await prisma.template.create({
      data: {
        name,
        description,

        templateDays: {
          create: parsedTemplateDays.map(day => ({
            name: day.day,

            templateWorkouts: {
              create: day.workouts.map(workout => ({
                exercise: {
                  connect: {
                    id: Number(workout.exerciseId)
                  }
                },

                sets: {
                  create: workout.sets.map(set => ({
                    setNo: Number(set.setNo),

                    weight:
                      set.weight === "" || set.weight == null
                        ? 0
                        : Number(set.weight),

                    repetitions:
                      set.reps === "" || set.reps == null
                        ? 0
                        : Number(set.reps)
                  }))
                }
              }))
            }
          }))
        }
      },

      include: {
        templateDays: {
          include: {
            templateWorkouts: {
              include: {
                exercise: true,
                sets: true
              }
            }
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(400).json({
        success: false,
        message: "Invalid exerciseId provided"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

//============================================ Get All Templates ========================================================//

async function getAllTemplates(req, res) {
    try {
        const templates = await prisma.template.findMany({
            include: {
                templateDays: {
                    include: {
                        templateWorkouts: {
                            include: {
                                exercise: true,
                                sets: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (templates.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No templates found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Templates retrieved successfully",
            data: templates
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

//============================================ Get Template by ID ========================================================//

async function getTemplateById(req, res) {
    const { templateId } = req.params;

    if (!templateId) {
        return res.status(400).json({
            success: false,
            message: "Template ID is required"
        });
    }

    try {
        const template = await prisma.template.findUnique({
            where: { id: parseInt(templateId) },
            include: {
                templateDays: {
                    include: {
                        templateWorkouts: {
                            include: {
                                exercise: true,
                                sets: true
                            }
                        }
                    }
                }
            }
        });

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Template retrieved successfully",
            data: template
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

//============================================ Get Templates by Difficulty ========================================================//


async function getTemplatesByDifficulty(req, res) {
    const { difficulty } = req.params;

    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];

    if (!difficulty || !validDifficulties.includes(difficulty)) {
        return res.status(400).json({
            success: false,
            message: "Valid difficulty level required: Beginner, Intermediate, or Advanced"
        });
    }

    try {
        const templates = await prisma.template.findMany({
            where: { difficulty },
            include: {
                templateDays: {
                    include: {
                        templateWorkouts: {
                            include: {
                                exercise: true,
                                sets: true
                            }
                        }
                    }
                }
            }
        });

        if (templates.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No templates found for difficulty: ${difficulty}`,
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Templates retrieved successfully",
            data: templates
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

//============================================ Update Template ========================================================//

async function updateTemplate(req, res) {
    const { templateId } = req.params;
    const { name, description, duration, difficulty } = req.body;

    if (!templateId) {
        return res.status(400).json({
            success: false,
            message: "Template ID is required"
        });
    }

    try {
        const existingTemplate = await prisma.template.findUnique({
            where: { id: parseInt(templateId) }
        });

        if (!existingTemplate) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        const updatedTemplate = await prisma.template.update({
            where: { id: parseInt(templateId) },
            data: {
                name: name || existingTemplate.name,
                description: description !== undefined ? description : existingTemplate.description,
                duration: duration || existingTemplate.duration,
                difficulty: difficulty || existingTemplate.difficulty
            },
            include: {
                templateDays: {
                    include: {
                        templateWorkouts: {
                            include: {
                                exercise: true,
                                sets: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Template updated successfully",
            data: updatedTemplate
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

//============================================ Delete Template ========================================================//

async function deleteTemplate(req, res) {
    const { templateId } = req.params;

    if (!templateId) {
        return res.status(400).json({
            success: false,
            message: "Template ID is required"
        });
    }

    try {
        const existingTemplate = await prisma.template.findUnique({
            where: { id: parseInt(templateId) }
        });

        if (!existingTemplate) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        await prisma.template.delete({
            where: { id: parseInt(templateId) }
        });

        return res.status(200).json({
            success: true,
            message: "Template deleted successfully"
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

export { createTemplate, getAllTemplates, getTemplateById, getTemplatesByDifficulty, updateTemplate, deleteTemplate };
