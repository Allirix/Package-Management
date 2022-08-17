import { createContext, useContext } from "react";
import { useDeliveryLocations as _useDeliveryLocations } from "../hooks/useDeliveryLocations";

const Location = createContext();
export const useDeliveryLocations = () => useContext(Location);

export default function LocationProvider({ children }) {
  const value = _useDeliveryLocations();
  return <Location.Provider value={value}>{children}</Location.Provider>;
}
