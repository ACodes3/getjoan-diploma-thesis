import "dotenv/config";
import express, { Request, Response } from "express";
import { ref, set } from "firebase/database";
import { db } from "./firebase/db.js";
import { speechToText } from "./functions/speechToText.js";

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json({
    limit: "50mb"
}));

app.post("/speech-to-text", (req: Request, res: Response) => {
  speechToText(req, res);
});

app.post("/message", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    await set(ref(db, "message"), message);

    console.log("Manual message sent to Firebase:", message);

    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Firebase message error:", error);

    return res.status(500).json({
      error: "Failed to send message",
    });
  }
});

app.get("/", (req, res) => {
  res.send("The Speech-to-text API is running.");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
