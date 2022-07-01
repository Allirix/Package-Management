import { useMemo } from "react";
import { getDistance } from "..";
import { useMyPositionContext } from "../providers";

export const useStreets = (search, selected) => {
  const location = useMyPositionContext();

  const display = useMemo(() => {
    if (!selected) return {};
    return selected
      .filter(bySearch(search))
      .map(addDistance(location))
      .sort(sort("number"))
      .sort(sort("name"))
      .sort(sort("distance"))
      .sort((a, b) => b.time.delivered - a.time.delivered)
      .sort(sort("delivered"))
      .reduce(toDictionary, {});
  }, [search, selected, location]);

  const delivered = display?.Delivered?.reduce(
    (acc, e) => {
      const hr = new Date(e.time.delivered).getHours();
      return {
        ...acc,
        [hr]: acc[hr] + 1,
      };
    },
    { ...new Array(24).fill(0) }
  );

  const total =
    delivered &&
    Object.keys(delivered)
      ?.map((e) => delivered[e])
      .filter((e) => e > 0);

  return {
    suburbs: Object.keys(display),
    display,
    averagePerHour: total?.reduce((acc, e) => acc + e, 0) / total?.length,
  };
};

const bySearch = (search) => (e) =>
  (e.name.toUpperCase() + " " + e.type.toLowerCase()).includes(search.trim()) ||
  e.suburb.toUpperCase().includes(search.trim()) ||
  e.number.toString().toUpperCase().includes(search.trim());

const addDistance = (location) => (street, id) => ({
  ...street,
  id,
  suburb: street.delivered ? "Delivered" : street.suburb,
  distance: getDistance(street, location),
});

const toDictionary = (acc, e) => {
  if (!acc[e.suburb]) acc[e.suburb] = [];
  acc[e.suburb] = acc[e.suburb].concat(e);
  return acc;
};

const sort =
  (key, order = 1) =>
  (a, b) =>
    order * (a[key] - b[key]);
