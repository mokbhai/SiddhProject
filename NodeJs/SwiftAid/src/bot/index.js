import express from "express";
import runOpenAIRequest from "./ai.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  try {
    let { prompt, ambulanceId, userId, location } = req.body;
    let result = await runOpenAIRequest(prompt, ambulanceId, userId, location);
    console.log(result);
    res.status(200).send(result);
  } catch (error) {
    // console.error("Error while sending response: ", error);
    res.status(500).send("An error occurred.");
  }
});

export default app;
