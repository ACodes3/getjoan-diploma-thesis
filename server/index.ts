import "dotenv/config";
import express, { Request, Response } from "express";
import { speechToText } from "./functions/speechToText.js";

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json({
    limit: "50mb"
}));

app.post("/speech-to-text", (req: Request, res: Response) => {
  speechToText(req, res);
});

app.get("/", (req, res) => {
  res.send("The Speech-to-text API is running.");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
