import { ChakraProvider } from "@chakra-ui/react";

import LocationProvider, { useDeliveryLocations } from "./LocationProvider";
import DeliveryDbProvider, { useDeliveryDb } from "./DeliveryDbProvider";
import MyPositionProvider, { useMyPosition } from "./MyPositionProvider";

import SortedDeliveryProvider, {
  useSortedDelivery,
} from "./SortedDeliveryDataProvider";

export default function Provider({ children }) {
  return (
    <ChakraProvider resetCSS={true}>
      <DeliveryDbProvider>
        <MyPositionProvider>
          <LocationProvider>
            <SortedDeliveryProvider>{children}</SortedDeliveryProvider>
          </LocationProvider>
        </MyPositionProvider>
      </DeliveryDbProvider>
    </ChakraProvider>
  );
}

export {
  useDeliveryLocations,
  useDeliveryDb,
  useMyPosition,
  useSortedDelivery,
};
