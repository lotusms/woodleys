import { getAuth } from "firebase/auth";
import { getFirebaseApp } from "./app-client.js";

let authInstance = null;

/** Firebase Auth (browser only). */
export function getFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser.");
  }
  if (authInstance) return authInstance;
  authInstance = getAuth(getFirebaseApp());
  return authInstance;
}
