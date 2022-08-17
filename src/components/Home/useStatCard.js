import { useMemo } from "react";
import { useSortedDelivery } from "../../utils/providers";
import { countHours } from "../../utils/hooks/utils";

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

    console.log({
      time,
      average,
      deliveredLocations,
      o: Object.values(countHours(delivered)),
    });

    return {
      average,
      locations: [deliveredLocations, totalLocations],
      parcels: totalParcels,
    };

    // const speed = !(deliverTime && Object.keys(deliverTime).length > 0)
    //   ? 0
    //   : totalParcels /
    //     Object.values(deliverTime).filter((deliveries) => deliveries > 0)
    //       .length;

    // return {
    //   speed,
    //   total: remaining + delivered,
    //   percentage: Math.round((100 * delivered) / (delivered + remaining)),
    //   parcels: remainingParcels + "/" + totalParcels,
    //   places: remaining + "/" + (delivered + remaining),
    // };
  }, [delivered, undelivered]);
};
