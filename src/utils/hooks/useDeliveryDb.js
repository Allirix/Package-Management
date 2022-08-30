import useLocalStorage from "./useLocalStorage";
import hash from "object-hash";

import { getLatLong } from "..";
import useHistory from "./useHistory";
import { useEffect } from "react";

const initialDelivery = () => ({
  createdAt: new Date().getTime(),
});

// Delivery Database State to store an array of deliveries
export default function useDeliveryData() {
  const [db, set] = useLocalStorage("db", []);
  const { addHistory, undo } = useHistory(set);

  useEffect(() => {
    (async () => {
      // #TODO: Add proper effect handling
      const newDbPromise = await Promise.all(
        db.map(async (e) =>
          e.lat !== undefined ? e : { ...e, ...(await getLatLong(e)) }
        )
      );
      set(newDbPromise);
      addHistory(newDbPromise);
    })();
  }, [db.length]);

  return {
    selected: db,
    undo,
    set,
    dispatch: (type, payload) =>
      set((d) => addHistory(reducer(d, { type, payload }))),
  };
}

export const reducer = (state, { type, payload }) =>
  actions[type](state, payload);

export const actions = {
  addAddress: (state, payload) => {
    return [...state, { ...payload }];
  },
  reset: () => [],
  remove: (deliveries, id) => {
    return deliveries.map((s) => (s.id !== id ? s : { ...s, parcels: [] }));
  },
  edit: (deliveries, { id, key, value }) =>
    deliveries.map((d) => (d.id === id ? { ...d, [key]: value } : d)),
  add: (deliveries, place) => {
    const { name, number, type, suburb } = place;
    const newHash = hash({ name, number, type, suburb });

    console.log(place);

    if (place.id) {
      const existing = deliveries.filter((e) => e.id === newHash)[0];
      return deliveries.map((d) =>
        d.id === existing.id
          ? {
              ...existing,
              parcels: place.parcels,
              notes: place.notes,
              atl: place.atl,
            }
          : d
      );
    } else {
      return [
        ...deliveries,
        {
          ...initialDelivery(),
          ...place,
          id: newHash,
        },
      ];
    }
  },

  toggle: (deliveries, id) => {
    // remove parcels array.
    return deliveries.map((d) =>
      d.id === id ? { ...d, parcels: [], deliveredAt: new Date().getTime() } : d
    );
  },

  overwrite: (deliveries, payload) => payload,

  editParcel: (deliveries, { id, index, parcel }) => {
    let parcels = deliveries.find((d) => d.id === id).parcels.slice(0);
    parcels[index] = parcel;
    return deliveries.map((d) => (d.id === id ? { ...d, parcels } : d));
  },

  removeParcel: (deliveries, { id, index }) => {
    let parcels = deliveries.find((d) => d.id === id).parcels.slice(0);
    parcels.splice(index, 1);
    return deliveries.map((d) => (d.id === id ? { ...d, parcels } : d));
  },
};

export const ACTION_TYPES = Object.keys(actions);

// export const actions = (set) => ({
//   edit: (id) => (key) => (value) =>
//     set((s) => {
//       const newStreets = s.slice(0);
//       newStreets[id][key] = value;
//       addHistory(newStreets);
//       return newStreets;
//     }),
//   editParcel:
//     (id) =>
//     (i) =>
//     ({ type, size, color }) =>
//     () =>
//       set((s) => {
//         const newStreets = s.slice(0);

//         let parcels = newStreets[id].parcels.slice(0);
//         parcels[i] = { type, size, color };
//         newStreets[id].parcels = parcels;
//         newStreets[id].updatedAt = new Date().getTime();
//         addHistory(newStreets);

//         return newStreets;
//       }),
//   removeParcel: (id) => (i) => () => {
//     set((s) => {
//       const newStreets = s.slice(0);
//       newStreets[id].parcels = newStreets[id].parcels.filter(
//         (e, ind) => ind !== i
//       );
//       newStreets[id].count -= 1;
//       newStreets[id].updatedAt = new Date().getTime();

//       addHistory(newStreets);

//       return newStreets;
//     });
//   },
//   remove: (id) => () => set((s) => s.filter((e, i) => id !== i)),
//   reset: () => [set([])],
//   add: async (obj) => {
//     set((selected) => {
//       const existing = selected.findIndex(findExisting(obj));

//       if (existing === -1) {
//         const googleMapsLoc = getLatLong(obj);
//         const street = {
//           ...obj,
//           ...googleMapsLoc,
//           ...initialDelivery(),
//         };

//         const newStreets = selected.concat(street);
//         addHistory(newStreets);
//         return newStreets;
//       } else {
//         let newStreets = selected.slice(0);
//         newStreets[existing] = obj;
//         newStreets[existing].updatedAt = new Date().getTime();

//         addHistory(newStreets);
//         return newStreets;
//       }
//     });
//   },

//   toggle: (i) => () =>
//     set((st) => {
//       let newStreets = st.slice(0);

//       console.log(i);

//       newStreets[i] = { ...newStreets[i] }; // new reference

//       const wasDelivered = newStreets[i].delivered;

//       newStreets[i].delivered = !wasDelivered;
//       newStreets[i].deliveredAt = wasDelivered ? null : new Date().getTime();
//       newStreets[i].updatedAt = new Date().getTime();

//       addHistory(newStreets);
//       return newStreets;
//     }),
// });

export const findExisting = (obj) => (e) =>
  e.type === obj.type &&
  e.number === obj.number &&
  e.suburb === obj.suburb &&
  e.name === obj.name;