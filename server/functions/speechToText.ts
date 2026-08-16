// speechToText.ts
import { Request, Response } from "express";
import { ref, set } from "firebase/database";
import { db } from "../firebase/db.js";
import { speechToCommand } from "./speechToCommand.js";


const AAI_BASE = "https://api.assemblyai.com/v2";
const AAI_KEY = process.env.ASSEMBLYAI_API_KEY as string;

export const speechToText = async (req: Request, res: Response) => {
  try {
    const { audioBase64, audioUrl, config } = req.body || {};
    const languageCode = config?.languageCode || "en";

    if (!audioBase64 && !audioUrl) {
      return res.status(400).send("Provide audioBase64 or audioUrl");
    }
    if (!AAI_KEY) return res.status(500).send("Missing AssemblyAI API key");

    // If base64 provided, upload raw bytes to AssemblyAI
    let audio_url = audioUrl as string | undefined;
    if (audioBase64) {
      const bytes = Buffer.from(audioBase64, "base64");
      const up = await fetch(`${AAI_BASE}/upload`, {
        method: "POST",
        headers: { Authorization: AAI_KEY },
        body: bytes,
      });
      if (!up.ok) return res.status(up.status).send(await up.text());
      const ujson = await up.json(); // { upload_url }
      audio_url = ujson.upload_url;
    }

    // Create transcript
    const create = await fetch(`${AAI_BASE}/transcript`, {
      method: "POST",
      headers: {
        Authorization: AAI_KEY,          // NOTE: no "Bearer"
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        audio_url,
        language_code: languageCode,     // e.g., "en", "sl", "de"
        punctuate: true,
        format_text: true,
      }),
    });
    if (!create.ok) return res.status(create.status).send(await create.text());
    const { id } = await create.json();

    // Poll
    const start = Date.now();
    const timeoutMs = 120_000;
    while (true) {
      const r = await fetch(`${AAI_BASE}/transcript/${id}`, {
        headers: { Authorization: AAI_KEY, Accept: "application/json" },
      });
      if (!r.ok) return res.status(r.status).send(await r.text());
      const tr = await r.json();

    if (tr.status === "completed") {
      console.log("ASSEMBLYAI TRANSCRIPT:", tr.text);

      // Convert raw transcription into a predefined command
      const command = speechToCommand(tr.text || "");

      // Nothing recognized
      if (!command) {
        console.log("NO SUPPORTED COMMAND FOUND");

        return res.status(422).json({
          id: tr.id,
          transcript: tr.text,
          command: null,
          error: "No supported voice command was detected.",
        });
      }

      console.log("COMMAND DETECTED:", command);

      // Send ONLY the predefined command to Firebase / Joan
      try {
        await set(
          ref(db, "message"),
          command.message
        );

        console.log(
          "FIREBASE COMMAND WRITE SUCCESS:",
          command.message
        );
      } catch (firebaseError) {
        console.error(
          "FIREBASE WRITE ERROR:",
          firebaseError
        );

        return res.status(500).json({
          error:
            "Command was recognized but could not be sent to Joan.",
        });
      }

      // Send detected command back to the mobile app
      return res.json({
        id: tr.id,
        transcript: tr.text,
        confidence: tr.confidence,

        command: {
          category: command.category,
          option: command.option,
          message: command.message,
        },
      });
    }
      if (tr.status === "error") {
        return res.status(500).send(`Transcription error: ${tr.error}`);
      }
      if (Date.now() - start > timeoutMs) {
        return res.status(504).send("Transcription timed out");
      }
      await new Promise((z) => setTimeout(z, 1500));
    }
  } catch (e: any) {
    console.error("speechToText error:", e);
    return res.status(500).send(e?.message || "Internal Server Error");
  }
};
