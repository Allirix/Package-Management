import { useMemo } from "react";
import { useDeliveryDb, useSortedDelivery } from "../../utils/providers";
import Place from "./Place";

export default () => {
  const { dispatch } = useDeliveryDb();
  const { undelivered, isEmpty } = useSortedDelivery();

  // memoise list to ignore rerendering from parent updates
  const suburbList = useMemo(() => {
    return undelivered.map((street) => (
      <Place
        key={street.id}
        i={street.id}
        street={street}
        remove={() => dispatch("remove", street.id)}
        toggle={() => dispatch("toggle", street.id)}
        editATL={(value) =>
          dispatch("edit", { id: street.id, key: "atl", value })
        }
      />
    ));
  }, [undelivered]);

  return {
    suburbList,
    isEmpty,
  };
};
