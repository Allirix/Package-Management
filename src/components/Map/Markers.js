import { Marker } from "@react-google-maps/api";

import { useMemo } from "react";
import { useDeliveryDb } from "../../utils/providers";
import { colors, icons } from "./utils";

export default ({ setHighlighted }) => {
  const { selected } = useDeliveryDb();
  const onClick = (e) => {
    for (let i = 0; i < selected.length; i++) {
      if (
        selected[i].lat === e.latLng.lat() &&
        selected[i].lng === e.latLng.lng()
      ) {
        setHighlighted(i);
        break;
      }
    }
  };

  return useMemo(() => {
    return (
      selected &&
      selected.map((street, i) => {
        const isDelivered = street.delivered;
        const label = {
          className:
            "marker-label marker-label--" + street.suburb[0].toLowerCase(),
          text: isDelivered
            ? new Date(street.deliveredAt).getHours() +
              ":" +
              leadingZero(new Date(street.deliveredAt).getMinutes())
            : street.number + " " + street.name,
        };
        const markerIcon = {
          path: isDelivered ? icons.dot : icons[street.suburb[0]],
          fillColor: colors[street.suburb[0]],
          fillOpacity: 0.9,
          scale: 0.3,
          strokeWeight: 0,
        };
        return (
          <Marker
            onClick={onClick}
            key={"marker-" + i}
            options={{ optimized: true }}
            icon={markerIcon}
            position={street}
            label={label}
          />
        );
      })
    );
  }, [selected]);
};

const leadingZero = (num) => (num < 10 ? "0" + num : num);
