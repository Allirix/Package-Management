import { Flex } from "@chakra-ui/react";
import { useMemo } from "react";

import { useDeliveryDb, useSortedDelivery } from "../../utils/providers";
import Street from "./Place";

export default ({ suburb }) => {
  const { dispatch } = useDeliveryDb();
  const { display } = useSortedDelivery();

  const streets = useMemo(
    () =>
      display[suburb].map((street, i) => (
        <Street
          key={street.id}
          i={street.id}
          street={street}
          remove={() => dispatch("remove", street.id)}
          toggle={() => dispatch("toggle", street.id)}
          editATL={(value) =>
            dispatch("edit", { id: street.id, key: "atl", value })
          }
        />
      )),
    [display, suburb]
  );

  return (
    <Flex gap="4px" flexDir="column" fontFamily='"Montserrat", sans-serif'>
      {streets}
    </Flex>
  );
};
