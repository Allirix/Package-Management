import { auth } from "../../model";

import {
  getAuth,
  signInWithEmailAndPassword,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";

export const signIn = (setUser) => async (email, password) => {
  try {
    console.log("Attempting login", { email, password });
    // await setPersistence(auth, inMemoryPersistence);

    const user = await signInWithEmailAndPassword(auth, email, password);

    // console.log(JSON.stringify(user));

    setUser({ email, password });

    return { ...user, error: false };
  } catch (e) {
    setUser(null);

    return { ...e, error: true };
  }
};

if (localStorage.getItem("user") !== null) {
  const { email, password } = JSON.parse(localStorage.getItem("user"));

  signIn(email, password);
}
