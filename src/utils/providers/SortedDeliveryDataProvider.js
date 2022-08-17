import { createContext, useContext } from "react";
import { useSortedDelivery as _useSortedDelivery } from "../hooks/useSortedDelivery";

const Street = createContext();
export const useSortedDelivery = () => useContext(Street);

export default function SortedDeliveryDataProvider({ children }) {
  const value = _useSortedDelivery();
  return <Street.Provider value={value}>{children}</Street.Provider>;
}
