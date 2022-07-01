import { createContext, useContext } from "react";
import usePosition from "../hooks/usePosition";

export const PositionContext = createContext();

export const usePositionContext = () => useContext(PositionContext);

export default function PositionProvider({ children }) {
  const position = usePosition();

  return (
    <PositionContext.Provider value={position}>
      {children}
    </PositionContext.Provider>
  );
}
