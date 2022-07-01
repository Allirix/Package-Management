import { useEffect } from "react";

import rawStreets from "../../data/streets.json";
import useLocalStorage from "./useLocalStorage";

export const useLocations = () => {
  const [locations, setLocations] = useLocalStorage("all-streets", rawStreets);

  return {
    locations,

    reset: () => setLocations(rawStreets),

    remove: (id) => () =>
      setLocations((location) =>
        location.slice(0, id).concat(location.slice(id + 1, location.length))
      ),

    add: (selectedSuburb, location) =>
      setLocations((locations) =>
        locations.concat({
          ...location,
          suburb: selectedSuburb,
          id: locations.length,
        })
      ),

    edit: (id) => (key, value) => {
      setLocations((locations) => {
        const newLocations = locations.slice(0);
        newLocations[id][key] = value;
        return newLocations;
      });
    },

    handleChange(e) {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = (e) => setLocations(JSON.parse(e.target.result));
    },
  };
};

export const downloadObj = (obj) => ({
  href: URL.createObjectURL(
    new Blob([JSON.stringify(obj)], { type: `text/json` })
  ),
  download: "data.json",
});
