import { useMemo } from "react";
import { useSortedDelivery } from "../providers";
import { countHours } from "./utils";

export default ({ delivered, undelivered }) => {
  return useMemo(() => {
    const deliveredLocations = delivered.length;
    const deliveredCount = delivered
      .filter(({ parcelsArchive }) => parcelsArchive)
      .flatMap((e) => {
        const keys = Object.keys(e.parcelsArchive);
        return keys.map((key) => {
          return {
            key: Number(key),
            date: new Date(Number(key)),
            length: e.parcelsArchive[key].reduce(
              (a, ee) => a + Number(ee.count),
              0
            ),
          };
        });
      })
      .filter((e) => isToday(e.key))
      .sort((a, b) => a.date - b.date);

    const MINUTES_TO_INGORE = 1;

    const ts =
      deliveredCount.length > 1 &&
      deliveredCount
        .map((e, i, arr) => (i === 0 ? 0 : e.key - arr[i - 1].key))
        .map((e) => e < 1000 * 60 * MINUTES_TO_INGORE);
    // const ignoredTime = ts > 1000 * 60 * MINUTES_TO_INGORE ? ts : 0;

    console.log(ts);

    const deliveredParcels = deliveredCount.reduce(
      (acc, e) => acc + e.length,
      0
    );

    const totalLocations = deliveredLocations + undelivered.length;

    let pickups = 0;

    const totalParcels =
      deliveredParcels +
      undelivered.reduce(
        (acc, e) =>
          acc +
          e.parcels.reduce((a, p) => {
            if (p.type === "PICKUP") pickups += Number(p.count);

            return a + Number(p.count);
          }, 0),
        0
      );

    const t = delivered.map((e) => e.deliveredAt).sort();
    const shiftLength = (t[t.length - 1] - t[0]) / (1000 * 3600);

    console.log(t);
    // const timeArray = Object.values(countHours(delivered));
    // const time = timeArray.reduce((acc, e) => acc + e, 0);

    return {
      pickups,
      average:
        isNaN(shiftLength) || shiftLength === 0
          ? 0
          : deliveredLocations / shiftLength,
      averageParcels:
        isNaN(shiftLength) || shiftLength === 0
          ? 0
          : deliveredParcels / shiftLength,
      locations: [totalLocations - deliveredLocations, totalLocations],
      parcels: [totalParcels - deliveredParcels, totalParcels],
    };
  }, [delivered, undelivered]);
};

function isEqualDate(d1, d2) {
  return d1.toLocaleString().startsWith(d2.toLocaleString().substring(0, 10));
}

const isToday = (str) => {
  return isEqualDate(new Date(parseInt(str)), new Date());
};
