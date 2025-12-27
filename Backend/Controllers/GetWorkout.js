import "dotenv/config";

import prisma from "../database.js";
//============================================== Get the Latest Routine ==============================//

async function getLatestRoutine(req, res) {
  const { enrollmentId } = req.body;

  if (!enrollmentId) {
    return res.status(400).json({
      success: false,
      message: "enrollmentId is required",
    });
  }

  const routine = await prisma.routine.findFirst({
    where: {
      split: {
        userId: enrollmentId, // enrollmentId → userSplit.userId
      },
    },
    orderBy: {
      id: "desc",
    },
    include: {
      day: {
        include: {
          workouts: {
            include: {
              exercise: {
                select: {
                  name: true,
                  muscleGroup: true,
                },
              },
              sets: true,
            },
          },
        },
      },
    },
  });

  if (!routine) {
    return res.status(404).json({
      success: false,
      message: "No routine found for this user",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Routine fetched successfully",
    data: routine,
  });
}

//========================================== Get All routines ==========================================//

async function getAllRoutine(req, res) {
  try {
    const { enrollmentId } = req.body;

    const routine = await prisma.routine.findMany({
      where: {
        split: {
          userId: enrollmentId,
        },
      },
      include: {
        day: {
          include: {
            workouts: {
              include: {
                exercise: {
                  select: {
                    name: true,
                    muscleGroup: true,
                  },
                },
                sets: true,
              },
            },
          },
        },
      },
    });

    // console.log(routine);

    return res.status(200).json({
      success: true,
      message: "Routine fetched successfully",
      data: routine,
    });
  } catch (err) {
    // console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching the users",
    });
  }
}

//TODO
//Write a function in which this gives all the users active routine means all the users latest active routines
async function getAllMemRoutine(req, res) {
  try {
    // Include split.userId so we can resolve the actual User (by enrollmentId)
    const routines = await prisma.routine.findMany({
      include: {
        split: {
          select: {
            userId: true,
          },
        },
        day: {
          include: {
            workouts: {
              include: {
                exercise: {
                  select: {
                    name: true,
                    muscleGroup: true,
                  },
                },
                sets: true,
              },
            },
          },
        },
      },
    });

    if (!routines || routines.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No members have routines",
      });
    }

    // Collect all enrollmentIds from the userSplit records
    const enrollmentIds = Array.from(
      new Set(routines.map((r) => r.split && r.split.userId).filter(Boolean))
    );

    // Fetch all corresponding users in one go
    const users = await prisma.user.findMany({
      where: {
        enrollmentId: {
          in: enrollmentIds,
        },
      },
      select: {
        enrollmentId: true,
        name: true,
      },
    });

    const userMap = Object.fromEntries(users.map((u) => [u.enrollmentId, u]));

    // Attach a `member` object to each routine (contains enrollmentId and name)
    const routinesWithMember = routines.map((r) => {
      const enrollmentId = r.split ? r.split.userId : null;
      const member = enrollmentId ? userMap[enrollmentId] || { enrollmentId } : null;
      return {
        ...r,
        member,
      };
    });

    return res.status(200).json({
      success: true,
      data: routinesWithMember,
      message: "Routines fetched successfully with member info",
    });
  } catch (err) {
    // console.log("This is the error : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching User",
    });
  }
}

//================================================================ Users without routine ==========================================//

async function isRoutine(req, res) {
  try {
    const usersWithoutRoutine = await prisma.userSplit.findMany({
      where: {
        routine: {
          none: {},
        },
      },
    });

    if (usersWithoutRoutine.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Routines of all the users are created",
      });
    }

    // console.log(usersWithoutRoutine);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: usersWithoutRoutine,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching the users",
    });
  }
}

export { getLatestRoutine, getAllRoutine, isRoutine,getAllMemRoutine };
