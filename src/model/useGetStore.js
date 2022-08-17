import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp } from ".";
import useLocalStorage from "../utils/hooks/useLocalStorage";

const options = {
  snapshotListenOptions: { includeMetadataChanges: false },
  getOptions: {
    source: "cache",
  },
};

export default (collectionId) => {
  const [state, setState] = useLocalStorage(`${collectionId}-state`, {
    localUpdatedAt: 0,
  });

  const [value, loading, error] = useCollection(
    query(
      collection(getFirestore(firebaseApp), collectionId),
      where("updatedAt", ">", z(state.localUpdatedAt)),
      orderBy("updatedAt", "desc")
    ),
    options
  );

  !loading && console.log(`Added reads ${value?.docs.length}`);

  useEffect(() => {
    if (value && "docs" in value) {
      const serverValues = value.docs.map((e) => ({ ...e.data(), _id: e.id }));

      if (serverValues?.length > 0) {
        const updates = serverValues.reduce(
          (acc, { _id, ...values }) => ({ ...acc, [_id]: values }),
          {}
        );
        setState((state) => ({
          ...state,
          ...updates,
          localUpdatedAt: new Date().getTime(),
        }));
      }
    }
  }, [value?.docs]);

  const data = useMemo(
    () => value?.docs.map((e) => ({ ...e.data(), _id: e.id })),
    [value?.docs]
  );

  return { value, loading, error, data };
};

const z = (v) => (v ? v : 0);
