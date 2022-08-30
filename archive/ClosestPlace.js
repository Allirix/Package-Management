import { useDeliveryDb, useSortedDelivery } from "../../utils/providers";

import Place from "../Deliveries/Place";

import { Flex } from "@chakra-ui/react";

import { BsPlusLg } from "react-icons/bs";
import { BiReset } from "react-icons/bi";
import { ImUndo } from "react-icons/im";
import { Link } from "react-router-dom";
import { ControlButton } from "../Deliveries/ControlButton";

export default function ClosestPlace() {
  const { dispatch } = useDeliveryDb();
  const { closest } = useSortedDelivery();

  return (
    <>
      <Place
        key={closest.id}
        i={closest.id}
        street={closest}
        toggle={() => dispatch("toggle", closest.id)}
        remove={() => dispatch("remove", closest.id)}
      />
    </>
  );
}

const Controls = () => {
  const { undo, dispatch } = useDeliveryDb();
  return (
    <Flex
      justifyContent={"flex-end"}
      h="60px"
      alignItems={"center"}
      gap="4px"
      color="white"
    >
      <ControlButton
        onClick={() => dispatch("reset")}
        Icon={BiReset}
        title="Remove All"
        background="var(--secondary-color-light)"
      />

      <ControlButton
        onClick={undo}
        Icon={ImUndo}
        title={"Undo"}
        background="var(--secondary-color-light)"
      />

      <Link to="/new/0">
        <ControlButton
          Icon={BsPlusLg}
          title="New"
          background="var(--secondary-color-light)"
        />
      </Link>
    </Flex>
  );
};
