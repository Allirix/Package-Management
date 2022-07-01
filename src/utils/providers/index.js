import LocationProvider, {
  useDeliveryLocationsContext,
} from "./LocationProvider";
import StreetProvider, { useStreetContext } from "./StreetProvider";
import MyPositionProvider, { useMyPositionContext } from "./MyPositionProvider";

export default function Provider({ children }) {
  return (
    <MyPositionProvider>
      <LocationProvider>
        <StreetProvider>{children}</StreetProvider>
      </LocationProvider>
    </MyPositionProvider>
  );
}

export {
  useDeliveryLocationsContext as useLocationsContext,
  useStreetContext,
  useMyPositionContext,
};
