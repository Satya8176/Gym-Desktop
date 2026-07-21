import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function createTest(req,res){

    const { userId, testEntries } = req.body;

    try {
        if (!userId || !testEntries) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        console.log("testEntries",testEntries)
        await prisma.test.upsert({
            where: { userId }, // since userId is unique
            update: {
                maxWeight: testEntries.maxWeight,
                maxReps: testEntries.maxReps,
                repExercise:testEntries.repExercise,
                weightExercise:testEntries.weightExercise
            },
            create: {
                userId,
                maxWeight: testEntries.maxWeight,
                maxReps: testEntries.maxReps,
                repExercise:testEntries.repExercise,
                weightExercise:testEntries.weightExercise
            },
        });


        // Update the user's testDone flag to true
        await prisma.user.update({
            where: {
                enrollmentId: userId,  // confirm this is the correct unique identifier
            },
            data: {
                testDone: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Test created successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating test"
        });
    }

    }

    async function showTest(req,res){

        const { userId } = req.body;

        try{

            const test = await prisma.test.findUnique({
                where: {
                    userId: userId,
                },
            });

            if(!test){

                return res.status(400).json({
                    success: false,
                    message: "No test found for the user"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Test found",
                data: test
            })

    }catch(error){
        
        console.log(error);

        return res.status(200).json({
            success:false,
            message: "Internal server error while fetching the test"
        })
    }
}


export {showTest, createTest}