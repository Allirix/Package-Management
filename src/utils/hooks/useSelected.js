import useLocalStorage from "./useLocalStorage";

import { getLatLong, getDistance } from "../";

const startState = () => ({
  delivered: false,
  deliverNumber: null,
  time: { added: new Date(), updated: null, delivered: null },
});

export default function useSelected() {
  const [selected, set] = useLocalStorage("selected", []);
  const [show, _showSuburb] = useLocalStorage("show", {});

  return {
    selected,
    set,
    show,
    showSuburb: (e) => _showSuburb((s) => ({ ...s, [e]: !s[e] })),
    remove: (id) => () => set((s) => s.filter((e, i) => id !== i)),
    reset: () => [set([]), localStorage.removeItem("selected")],
    add: (addHistory) => (location) => async (obj) => {
      const existing = selected.findIndex(findExisting(obj));

      if (existing === -1) {
        const googleMapsLoc = await getLatLong(obj);
        const street = {
          ...obj,
          ...googleMapsLoc,
          ...startState(),
          distance: getDistance(googleMapsLoc, location),
        };
        set((streets) => {
          const newStreets = streets.concat(street);
          addHistory(newStreets);
          return newStreets;
        });
      } else {
        console.log(obj.notes + " " + selected[existing].notes);
        const street = {
          ...selected[existing],
          parcels: selected[existing].parcels.concat(obj.parcels),
          notes: obj.notes + " " + selected[existing].notes,
        };
        set((streets) => {
          let newStreets = streets.slice(0);
          newStreets[existing] = street;
          addHistory(newStreets);
          return newStreets;
        });
      }

      _showSuburb((suburbs) => ({ ...suburbs, [obj.suburb]: true }));
    },

    toggle: (addHistory) => (i) => () =>
      set((st) => {
        console.log(st);
        let newStreet = st.slice(0);

        const wasDelivered = newStreet[i].delivered;

        newStreet[i].delivered = !wasDelivered;
        newStreet[i].time.delivered = wasDelivered ? null : new Date();

        addHistory(newStreet);
        return newStreet;
      }),
  };
}

const findExisting = (obj) => (e) =>
  e.type === obj.type &&
  e.number === obj.number &&
  e.suburb === obj.suburb &&
  e.name === obj.name;
