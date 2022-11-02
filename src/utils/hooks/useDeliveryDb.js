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
      if (!db.some((datum) => datum.lat === undefined)) return;
      console.log("Making request");
      // #TODO: Add proper effect handling
      const newDbPromise = await Promise.all(
        db.map(async (datum) =>
          datum.lat !== undefined
            ? datum
            : { ...datum, ...(await getLatLong(datum)) }
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
    dispatch: (type, payload, callback = () => true) =>
      set((d) => {
        const data = reducer(d, { type, payload });
        if (!callback(data)) {
          alert(
            `Unable to add ${JSON.stringify(
              payload
            )} due to error callback error`
          );
          return d;
        }
        addHistory(data);
        return data;
      }),
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
  removeLocation: (deliveries, id) => deliveries.filter((e) => e.id !== id),
  edit: (deliveries, { id, key, value }) =>
    deliveries.map((d) => (d.id === id ? { ...d, [key]: value } : d)),
  add: (deliveries, place) => {
    const { name, number, type, suburb } = place;
    const newHash = hash({ name, number, type, suburb });

    const existing = deliveries.filter((e) => e.id === place.id)[0];

    if (existing) {
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
    const time = new Date().getTime();

    return deliveries.map((d) =>
      d.id === id
        ? {
            ...d,
            parcelsArchive: { ...d?.parcelsArchive, [time]: d.parcels },
            parcels: [],
            deliveredAt: time,
          }
        : d
    );
  },
  readd: (deliveries, payload) => {
    const activeDelivery = deliveries.find((e) => e.id === payload);
    const [mostRecentParcel] = Object.keys(activeDelivery.parcelsArchive)
      .map((e) => ({
        date: new Date(Number(e)),
        key: Number(e),
        parcels: activeDelivery.parcelsArchive[e],
      }))
      .sort((a, b) => b.date - a.date)
      .slice(0);

    const newDeliveries = deliveries.map((e, i) => {
      if (e.id === payload) {
        const { parcels, parcelsArchive, ...del } = e;
        const { [mostRecentParcel.key]: remove, ...other } = parcelsArchive;
        console.log({ other, remove, e, i });
        return {
          ...del,
          parcels: [...parcels, ...mostRecentParcel.parcels],
          parcelsArchive: other,
          deliveredAt: null,
        };
      }
      return e;
    });

    console.log(newDeliveries);
    // return deliveries;
    return newDeliveries;
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
