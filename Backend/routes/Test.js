import express from 'express'

import { showTest, createTest } from "../Controllers/test.js"

const testRouter = express.Router();

testRouter.post("/create-test", createTest);
// testRouter.post("/retest", retest);
testRouter.post("/get-test", showTest);

export default testRouter;