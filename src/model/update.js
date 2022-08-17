import { doc, updateDoc } from "firebase/firestore";
import { db } from "./";

import actions from "./actions";

export default (action, payload, id) => update(actions[action], payload, id);

const update = (collectionName, payload, id) =>
  updateDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: new Date().getTime(),
  });

export const updateSuburb = (suburb, id) => update("suburbs", suburb, id);
export const updateStreet = (street, id) => update("streets", street, id);
export const updatePlace = (place, id) => update("places", place, id);
export const updateDelivery = (delivery, id) =>
  update("deliveries", delivery, id);
