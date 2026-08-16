import { auth, db } from "@/firebase";
import { push, ref, set } from "firebase/database";

export type NotificationType =
  | "success"
  | "error"
  | "info";

export async function saveNotification(
  type: NotificationType,
  title: string,
  message: string
) {
  const user = auth.currentUser;

  if (!user) {
    console.log("No logged-in user. Notification not saved.");
    return;
  }

  try {
    const notificationRef = push(
      ref(db, `notifications/${user.uid}`)
    );

    await set(notificationRef, {
      type,
      title,
      message,
      read: false,
      createdAt: Date.now(),
    });

    console.log("🔔 Notification saved:", title);
  } catch (error) {
    console.error(
      "❌ Could not save notification:",
      error
    );
  }
}