import { createContext, useContext } from "react";
import _useDeliveryDb from "../hooks/useDeliveryDb";

const DeliveryDb = createContext();
export const useDeliveryDb = () => useContext(DeliveryDb);

export default function DeliveryDbProvider({ children }) {
  const value = _useDeliveryDb();
  return <DeliveryDb.Provider value={value}>{children}</DeliveryDb.Provider>;
}
