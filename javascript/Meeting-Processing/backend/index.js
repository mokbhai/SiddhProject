import express from "express";
import cors from "cors";
import "dotenv/config";
import { summarize } from "./functions/index.js";
import { sendEmail } from "./functions/mail.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.post("/summarize", async (req, res) => {
  const { content } = req.body;
  const summary = await summarize(content);
  res.json({ summary });
});

app.post("/mail", async (req, res) => {
  const { email, summary } = req.body;
  const options = {
    to: email,
    subject: "Meeting Summary",
    text: summary,
  };
  const mail = await sendEmail(options);
  res.json({ message: "Mail sent successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
