import { createContext, useContext } from "react";
import { useDeliveryLocations } from "../hooks/useDeliveryLocations";

export const LocationContext = createContext();

export const useDeliveryLocationsContext = () => useContext(LocationContext);

export default function LocationProvider({ children }) {
  const locations = useDeliveryLocations();

  return (
    <LocationContext.Provider value={locations}>
      {children}
    </LocationContext.Provider>
  );
}
