import { useMemo } from "react";

import { onlyUnique, groupByAlphabet } from "..";
import { useStreetContext } from "../providers";
import { useLocationsContext } from "../providers/LocationProvider";
import useLocalStorage from "./useLocalStorage";

export const defaultStreet = {
  parcels: [],
  suburb: "Mitchelton",
  type: "",
  number: "",
  name: "",
  count: 0,
};
export const useNewParcel = () => {
  const [newStreet, setNewStreet] = useLocalStorage(
    "new-parcel",
    defaultStreet
  );
  const { locations } = useLocationsContext();
  const { add } = useStreetContext();

  const setParcelValue = (key) => (value) => {
    setNewStreet((s) => {
      let parcels = s.parcels.slice(0);
      if (!parcels[s.count]) parcels[s.count] = {};
      parcels[s.count][key] = value;
      return { ...s, parcels };
    });
  };

  const setValue = (key) => (value) => {
    setNewStreet((s) => ({ ...s, [key]: value }));
  };

  const inSuburb = (e) => !newStreet.suburb || e.suburb === newStreet.suburb;

  const startsWith = (e) =>
    !newStreet.type || newStreet.type.includes(e.name[0].toUpperCase());

  const suburbFiltered = locations.sort((a, b) => a.name - b.name);

  const suburbs = useMemo(
    () => locations.map((e) => e.suburb).filter(onlyUnique),
    [locations]
  );

  const types = useMemo(
    () => groupByAlphabet(suburbFiltered),
    [suburbFiltered]
  );

  return {
    setValue,
    setParcelValue,
    setStreet: setNewStreet,
    lists: {
      filteredStreets: suburbFiltered.filter(startsWith),
      suburbs,
      types,
      locations: suburbFiltered,
    },
    newStreet,
    add,
    reset: () => setNewStreet(defaultStreet),
  };
};
