import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";// Add this import for Realtime Database

// Initialize Firebase
const app = initializeApp(
  {
    apiKey: "AIzaSyD2TadzeJA8Y6l7juHhyOHZCxNGCRTPtco",
    authDomain: "crunchquest.firebaseapp.com",
    databaseURL: "https://crunchquest-default-rtdb.firebaseio.com/",
    projectId: "crunchquest",
    storageBucket: "crunchquest.appspot.com",
    messagingSenderId: "549371382667",
    appId: "1:549371382667:web:5e9f99bead57767e723d8e",
    measurementId: "G-4QX72M2HB6"// If you have Analytics enabled
  }
);

// Get the Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
export const database = getDatabase(app); // Export the database object

export default app; // You can export the app instance if needed
