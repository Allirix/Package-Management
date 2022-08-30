import { useMemo } from "react";
import { useSortedDelivery } from "../providers";
import { countHours } from "./utils";

export default () => {
  const { delivered, undelivered } = useSortedDelivery();

  return useMemo(() => {
    const deliveredLocations = delivered.length;
    const deliveredParcels = delivered.reduce(
      (acc, e) => acc + e.parcels.length,
      0
    );

    const totalLocations = deliveredLocations + undelivered.length;
    const totalParcels =
      deliveredParcels +
      undelivered.reduce((acc, e) => acc + e.parcels.length, 0);

    const timeArray = Object.values(countHours(delivered));

    const time = timeArray.reduce((acc, e) => acc + e, 0);

    const average = timeArray.length ? time / timeArray.length : 0;

    return {
      average,
      locations: [deliveredLocations, totalLocations],
      parcels: totalParcels,
    };
  }, [delivered, undelivered]);
};
