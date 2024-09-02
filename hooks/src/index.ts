import express from 'express'
import {PrismaClient} from "@prisma/client"


const client = new PrismaClient();

const app = express();


// Add Auth

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {

    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    // Store a the trigger in DB
    await client.$transaction(async tx => {

        const run = await client.zapRun.create({
            data: {
                zapId: zapId, 
                metadata: body
            }
        });

        await client.zapRunOutBox.create({
            data: {
                zapRunId: run.id
            }
        })
    })


    res.json({
        message: "Success"
    })


    // Push it to the queue
})


app.listen(3005, () => {
    console.log("Listening in port 3005")
})