import { useMemo } from "react";
import { getDistance } from "..";
import { usePositionContext } from "../providers";
import useHistory from "./useHistory";
import useSelected from "./useSelected";

export const useStreets = (search) => {
  const location = usePositionContext();
  const { selected, remove, add, toggle, set } = useSelected();
  const { addHistory, undo } = useHistory(set);

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

  return {
    suburbs: Object.keys(display),
    display,
    selected,
    set,
    toggle: toggle(addHistory),
    add: add(addHistory)(location),
    remove,
    undo,
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
