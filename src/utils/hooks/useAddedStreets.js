import useLocalStorage from "./useLocalStorage";

import { getLatLong } from "..";
import useHistory from "./useHistory";

const startState = () => ({
  delivered: false,
  time: { added: new Date(), updated: null, delivered: null },
});

export default function useAddedStreets() {
  const [selected, set] = useLocalStorage("selected", []);
  const { addHistory, undo } = useHistory(set);
  const [show, _showSuburb] = useLocalStorage("show", {});

  return {
    selected,
    set,
    show,
    undo,
    showSuburb: (e) => _showSuburb((s) => ({ ...s, [e]: !s[e] })),
    remove: (id) => () => set((s) => s.filter((e, i) => id !== i)),
    reset: () => [set([]), localStorage.removeItem("selected")],
    add: async (obj) => {
      const existing = selected.findIndex(findExisting(obj));

      if (existing === -1) {
        const googleMapsLoc = await getLatLong(obj);
        const street = {
          ...obj,
          ...googleMapsLoc,
          ...startState(),
        };
        set((streets) => {
          const newStreets = streets.concat(street);
          addHistory(newStreets);
          return newStreets;
        });
      } else {
        set((streets) => {
          let newStreets = streets.slice(0);
          newStreets[existing] = obj;
          addHistory(newStreets);
          return newStreets;
        });
      }

      _showSuburb((suburbs) => ({ ...suburbs, [obj.suburb]: true }));
    },

    toggle: (i) => () =>
      set((st) => {
        let newStreet = st.slice(0);

        const wasDelivered = newStreet[i].delivered;

        newStreet[i].delivered = !wasDelivered;
        newStreet[i].time.delivered = wasDelivered ? null : new Date();

        addHistory(newStreet);
        return newStreet;
      }),
  };
}

export const findExisting = (obj) => (e) =>
  e.type === obj.type &&
  e.number === obj.number &&
  e.suburb === obj.suburb &&
  e.name === obj.name;
