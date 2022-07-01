import { createContext, useContext, useState } from "react";
import useSelected from "../hooks/useSelected";
import { useStreets } from "../hooks/useStreets";

export const StreetContext = createContext();

export const useStreetContext = () => useContext(StreetContext);

export default function Provider({ children }) {
  const search = useState("");
  const streets = useStreets(search[0]);
  const functions = useSelected();

  return (
    <StreetContext.Provider
      value={{
        search,
        ...functions,
        ...streets,
      }}
    >
      {children}
    </StreetContext.Provider>
  );
}
