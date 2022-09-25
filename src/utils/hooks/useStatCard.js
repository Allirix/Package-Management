import { useMemo } from "react";
import { useSortedDelivery } from "../providers";
import { countHours } from "./utils";

export default () => {
  const { delivered, undelivered } = useSortedDelivery();

  return useMemo(() => {
    const deliveredLocations = delivered.length;
    const deliveredParcels = delivered
      .filter(({ parcelsArchive }) => parcelsArchive)
      .flatMap((e) => {
        const keys = Object.keys(e.parcelsArchive);
        return keys.map((key) => ({
          key,
          length: e.parcelsArchive[key].length,
        }));
      })
      .filter((e) => isToday(e.key))
      .reduce((acc, e) => acc + e.length, 0);

    const totalLocations = deliveredLocations + undelivered.length;
    const totalParcels =
      deliveredParcels +
      undelivered.reduce(
        (acc, e) => acc + e.parcels.reduce((a, p) => a + p.count, 0),
        0
      );

    console.log(undelivered);

    const t = delivered.map((e) => e.deliveredAt).sort();
    const shiftLength = (t[t.length - 1] - t[0]) / (1000 * 3600);

    // const timeArray = Object.values(countHours(delivered));
    // const time = timeArray.reduce((acc, e) => acc + e, 0);

    return {
      average:
        isNaN(shiftLength) || shiftLength === 0
          ? 0
          : deliveredParcels / shiftLength,
      locations: [deliveredLocations, totalLocations],
      parcels: [deliveredParcels, totalParcels],
    };
  }, [delivered, undelivered]);
};

function isEqualDate(d1, d2) {
  return d1.toISOString().startsWith(d2.toISOString().substring(0, 10));
}

const isToday = (str) => isEqualDate(new Date(parseInt(str)), new Date());
