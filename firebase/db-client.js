import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./app-client.js";
import { FIRESTORE_DATABASE_ID } from "./config.js";

let dbInstance = null;

/** Firestore instance for the configured database. */
export function getFirebaseDb() {
  if (typeof window === "undefined") {
    throw new Error("Firestore client is only available in the browser.");
  }
  if (dbInstance) return dbInstance;
  dbInstance = getFirestore(getFirebaseApp(), FIRESTORE_DATABASE_ID);
  return dbInstance;
}
