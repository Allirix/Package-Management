import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-use";
import { auth } from "../../model";
import useLocalStorage from "./useLocalStorage";

export default function useAuth() {
  const [user, setUser] = useLocalStorage("user", null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  function redirectToLogin() {
    location !== "/login" && navigate("/login");
  }

  function redirectToHome() {
    navigate("/");
  }

  async function login(email, password) {
    try {
      setLoading(true);

      console.log("Attempting login", { email, password });
      const user = await signInWithEmailAndPassword(auth, email, password);
      setUser({ ...user, email, password });
      redirectToHome();
      console.log({ user });
    } catch (e) {
      console.error(e);
      setError(e.message);
      setLoading(false);
      setUser(null);
    }
  }

  async function logout() {
    try {
      const user = await signOut(auth);
      console.log("signed out", { user });
      setUser(null);
    } catch (e) {
      console.error(e);
      setUser(null);
    }
  }

  useEffect(() => {
    if (user) {
      console.log({ user });
      login(user.email, user.password);
      redirectToHome();
    } else redirectToLogin();
  }, []);

  return { loading, login, logout, error, ...user, isLoggedIn: user === null };
}
