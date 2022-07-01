import LocationProvider, { useLocationsContext } from "./LocationProvider";
import StreetProvider, { useStreetContext } from "./StreetProvider";
import PositionProvider, { usePositionContext } from "./PositionProvider";

export default function Provider({ children }) {
  return (
    <PositionProvider>
      <LocationProvider>
        <StreetProvider>{children}</StreetProvider>
      </LocationProvider>
    </PositionProvider>
  );
}

export { useLocationsContext, useStreetContext, usePositionContext };
