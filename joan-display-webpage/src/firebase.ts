import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA1-zeqXV6dgctpIqk0EudFGirpYJGhI20",
  authDomain: "get-joan-message.firebaseapp.com",
  databaseURL: "https://get-joan-message-default-rtdb.firebaseio.com",
  projectId: "get-joan-message",
  storageBucket: "get-joan-message.firebasestorage.app",
  messagingSenderId: "822822620600",
  appId: "1:822822620600:web:034d8a4996a7696a50134d"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { onValue, ref };

