import { createContext, useContext } from "react";
import _useAuth from "../hooks/useAuth";

const Auth = createContext();
export const useAuth = () => useContext(Auth);

export default function DeliveryDbProvider({ children }) {
  const value = _useAuth();
  return <Auth.Provider value={value}>{children}</Auth.Provider>;
}
