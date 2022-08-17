import { Flex } from "@chakra-ui/react";
import { useDeliveryDb } from "../../utils/providers";
import Place from "../Deliveries/Place";

export default ({ highlighted }) => {
  const { selected, remove, toggle } = useDeliveryDb();

  if (highlighted === undefined) return null;

  return (
    <Flex p="4px 0">
      {(highlighted || highlighted === 0) && (
        <Place
          street={selected[highlighted]}
          toggle={toggle(highlighted)}
          remove={remove(highlighted)}
        />
      )}
    </Flex>
  );
};
