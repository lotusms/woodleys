import { getStorage } from "firebase/storage";
import { getFirebaseApp } from "./app-client.js";

let storageInstance = null;

/** Firebase Storage (browser only). */
export function getFirebaseStorage() {
  if (typeof window === "undefined") {
    throw new Error("Firebase Storage is only available in the browser.");
  }
  if (storageInstance) return storageInstance;
  storageInstance = getStorage(getFirebaseApp());
  return storageInstance;
}
