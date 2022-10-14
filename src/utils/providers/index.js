import { ChakraProvider } from "@chakra-ui/react";

import LocationProvider, { useDeliveryLocations } from "./LocationProvider";
import DeliveryDbProvider, { useDeliveryDb } from "./DeliveryDbProvider";
import MyPositionProvider, { useMyPosition } from "./MyPositionProvider";
import AuthProvider from "./AuthProvider";

import SortedDeliveryProvider, {
  useSortedDelivery,
} from "./SortedDeliveryDataProvider";

export default function Provider({ children }) {
  return (
    <ChakraProvider resetCSS={true}>
      <AuthProvider>
        <DeliveryDbProvider>
          <MyPositionProvider>
            <LocationProvider>
              <SortedDeliveryProvider>{children}</SortedDeliveryProvider>
            </LocationProvider>
          </MyPositionProvider>
        </DeliveryDbProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export {
  useDeliveryLocations,
  useDeliveryDb,
  useMyPosition,
  useSortedDelivery,
};
