// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { enableIndexedDbPersistence } from "firebase/firestore";

import {
  getAuth,
  setPersistence,
  signInWithPopup,
  inMemoryPersistence,
  GoogleAuthProvider,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import create, { createStreet } from "./create";
import update from "./update";
import data from "../data/streets.json";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUFzKs-pqfT5PUFMfkI0lmPMCoefHB7xo",
  authDomain: "package-organiser.firebaseapp.com",
  projectId: "package-organiser",
  storageBucket: "package-organiser.appspot.com",
  messagingSenderId: "533907189970",
  appId: "1:533907189970:web:38fe1b05aea1d14c5c7d0b",
  measurementId: "G-89KBSBPXY6",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    alert(
      "Multiple tabs open. Firebase DB failed. Please close all tabs and try again."
    );
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    alert(
      "Your browser does not support all of the features required to enable persistence."
    );
  }
});
// Subsequent queries will use persistence, if it was enabled successfully

// Initialize Firebase
const analytics = getAnalytics(firebaseApp);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

export { firebaseApp, analytics, db, auth };

// data.map((e) => createStreet(e));
