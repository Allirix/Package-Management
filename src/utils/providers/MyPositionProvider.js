import { createContext, useContext } from "react";
import _useMyPosition from "../hooks/useMyPosition";

const MyPosition = createContext();
export const useMyPosition = () => useContext(MyPosition);

export default function PositionProvider({ children }) {
  const value = _useMyPosition();
  return <MyPosition.Provider value={value}>{children}</MyPosition.Provider>;
}
