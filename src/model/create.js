import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import { db } from "./";

import actions from "./actions";

export default (action, payload) => create(actions[action], payload);

const create = (collectionName, payload) => {
  const at = new Date().getTime();
  const data = { ...payload, updatedAt: at, createdAt: at };
  const ref = collection(db, collectionName);
  console.log(`Adding data to ${collectionName}`, { data, ref });
  return addDoc(ref, data);
};

export const createSuburb = (suburb) => create("suburbs", suburb);
export const createStreet = (street) => create("streets", street);
export const createPlace = (place) => create("places", place);
export const createDelivery = (delivery) => create("deliveries", delivery);
