import { createContext, useContext } from "react";
import { useLocations } from "../hooks/useLocations";

export const LocationContext = createContext();

export const useLocationsContext = () => useContext(LocationContext);

export default function LocationProvider({ children }) {
  const locations = useLocations();

  return (
    <LocationContext.Provider value={locations}>
      {children}
    </LocationContext.Provider>
  );
}
