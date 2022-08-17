import { useMemo, useState } from "react";
import { getDistance } from "..";
import { useDeliveryDb, useMyPosition } from "../providers";

export const useSortedDelivery = () => {
  const { selected } = useDeliveryDb();
  const myPosition = useMyPosition();
  const [search, setSearch] = useState("");

  return {
    search,
    setSearch,

    ...useMemo(() => {
      if (!selected) return { undelivered: [], delivered: [] };
      const sorted = selected
        .filter(bySearch(search))
        .map(addDistance(myPosition))
        .sort(sort("distance"));
      const undelivered = sorted.filter(hasParcels);
      return {
        sorted,
        undelivered,
        delivered: sorted.filter(isDelivered),
        closest: undelivered[0],
        isEmpty: undelivered.length < 1,
      };
    }, [search, selected, myPosition]),
  };
};

const bySearch = (search) => (e) =>
  (e.name.toUpperCase() + " " + e.type.toLowerCase()).includes(search.trim()) ||
  e.suburb.toUpperCase().includes(search.trim()) ||
  e.number.toString().toUpperCase().includes(search.trim());

const addDistance = (myLocation) => (street) => ({
  ...street,
  distance: getDistance(street, myLocation),
});

export const toDictionary = (acc, e) => {
  if (!acc[e.suburb]) acc[e.suburb] = [];
  acc[e.suburb] = acc[e.suburb].concat(e);
  return acc;
};

const sort =
  (key, order = 1) =>
  (a, b) =>
    order * (a[key] - b[key]);

const hasParcels = ({ parcels }) => parcels?.length > 0;

const isDelivered = (e) => {
  return isSameDate(e) && isRecent(e);
};

const isRecent = (e) => {
  const t = new Date().getTime();
  const d = new Date(e.deliveredAt).getTime();
  return t - d < 1000 * 60 * 60 * 24 * 7;
};

const isSameDate = (e) => {
  const t = new Date().getDate();
  const d = new Date(e.deliveredAt).getDate();
  return t === d;
};
