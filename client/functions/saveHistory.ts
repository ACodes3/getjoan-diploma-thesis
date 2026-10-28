import { auth, db } from "@/firebase";
import { push, ref, set } from "firebase/database";

export type HistoryType = "manual" | "voice";

export async function saveHistory(
  type: HistoryType,
  message: string
) {
  const user = auth.currentUser;

  if (!user) {
    console.log("No logged-in user. History not saved.");
    return;
  }

  try {
    const historyRef = push(
      ref(db, `history/${user.uid}`)
    );

    await set(historyRef, {
      type,
      message,
      createdAt: Date.now(),
    });

    console.log("History saved:", message);
  } catch (error) {
    console.error(
      "Could not save history:",
      error
    );
  }
}