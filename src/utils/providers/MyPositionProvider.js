import { createContext, useContext } from "react";
import useMyPosition from "../hooks/useMyPosition";

export const PositionContext = createContext();

export const useMyPositionContext = () => useContext(PositionContext);

export default function PositionProvider({ children }) {
  const position = useMyPosition();

  return (
    <PositionContext.Provider value={position}>
      {children}
    </PositionContext.Provider>
  );
}
