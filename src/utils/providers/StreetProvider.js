import { createContext, useContext, useState } from "react";
import useAddedStreets from "../hooks/useAddedStreets";
import { useStreets } from "../hooks/useStreets";

export const StreetContext = createContext();

export const useStreetContext = () => useContext(StreetContext);

export default function Provider({ children }) {
  const search = useState("");
  const context = useAddedStreets();
  const streets = useStreets(search[0], context.selected);

  return (
    <StreetContext.Provider
      value={{
        search,
        ...context,
        ...streets,
      }}
    >
      {children}
    </StreetContext.Provider>
  );
}
