import { RiCloseFill } from "react-icons/ri";

import { Button, Flex, Text } from "@chakra-ui/react";
import { BiNavigation } from "react-icons/bi";
import { AiOutlineUndo } from "react-icons/ai";

import { BsArrowReturnLeft, BsFillCheckCircleFill } from "react-icons/bs";
import { getGoogleMapsDirURL } from "./utils";
import { useDeliveryDb, useMyPosition } from "../../utils/providers";

export default function Controls({ street, showCheck = true, onComplete }) {
  const { dispatch } = useDeliveryDb();

  const isPickup = street.parcels.some((e) => e.type === "PICKUP");
  const isShop = street.number === "";

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      flexDirection="column"
    >
      <NavigationButton
        street={street}
        background={isPickup ? "orange.800" : isShop ? "blue.800" : "green.800"}
      />

      <ControlButton
        onClick={
          showCheck
            ? () => dispatch("toggle", street.id, onComplete(street))
            : () => dispatch("readd", street.id)
        }
        Icon={showCheck ? BsFillCheckCircleFill : AiOutlineUndo}
        title={showCheck ? "Deliver" : "Delete"}
        background={showCheck ? "yellow.800" : "red.800"}
      />
    </Flex>
  );
}

export const ControlButton = ({
  onClick,
  Icon,
  title,
  color = "white",
  background = "green.800",
  ...styles
}) => {
  return (
    <Button
      onClick={onClick}
      background={background}
      h="100%"
      minH="40px"
      w="50px"
      color={color}
      textTransform="uppercase"
      // border="1px solid gray"
      borderRadius="0px"
      // boxShadow={
      //   `2px 2px 10px -8px black, -2px -2px 10px -8px ${color}, inset 2px 2px 2px -3px white, 0 0 10px -5px black, inset 0 0 4px -2px ` +
      //   color
      // }
      // boxShadow={`inset 0 0 3px -2px ${color}`}
      {...{ ...styles }}
    >
      <Flex flexDir="column" alignItems="center" gap="4px" opacity="0.9">
        {Icon && <Icon size="25px" />}
        {/* <Text fontSize="5px" textShadow={`0px 0px 1px ${color}`} mt="-2px">
          {title}
        </Text> */}
      </Flex>
    </Button>
  );
};

const NavigationButton = ({ street, background }) => {
  const myPosition = useMyPosition();

  return (
    <ControlButton
      onClick={() =>
        window.open(getGoogleMapsDirURL(street)(myPosition), "_blank")
      }
      Icon={BiNavigation}
      title="Navigate"
      height="50%"
      background={background}
    />
  );
};
