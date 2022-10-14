import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

export const signout = () =>
  signOut(auth)
    .then((user) => {
      alert("signed out", { user });
      localStorage.removeItem("user");
    })
    .catch((error) => {
      // An error happened.
      localStorage.removeItem("user");
    });
