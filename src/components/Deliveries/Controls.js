import { RiCloseFill } from "react-icons/ri";

import { Button, Flex, Text } from "@chakra-ui/react";
import { BiNavigation } from "react-icons/bi";
import { BsArrowReturnLeft, BsFillCheckCircleFill } from "react-icons/bs";
import { getGoogleMapsDirURL } from "./utils";
import { useDeliveryDb, useMyPosition } from "../../utils/providers";

export default function Controls({ street, showCheck = true }) {
  const { dispatch } = useDeliveryDb();

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      gap="8px"
      color="white"
      borderRadius={"4px"}
      flexDir="column"
    >
      <NavigationButton street={street} />
      <ControlButton
        onClick={
          showCheck
            ? () => dispatch("toggle", street.id)
            : () => dispatch("remove", street.id)
        }
        Icon={showCheck ? BsFillCheckCircleFill : RiCloseFill}
        title={showCheck ? "Deliver" : "Delete"}
        color={showCheck ? "white" : "red"}
        height="70px"
      />
    </Flex>
  );
}

export const ControlButton = ({
  onClick,
  Icon,
  title,
  color = "var(--ternary-color-lightest)",
  background = "var(--secondary-color)",
  ...styles
}) => {
  return (
    <Button
      onClick={onClick}
      background={background}
      h="50px"
      w="60px"
      color={color}
      textTransform="uppercase"
      boxShadow={
        `2px 2px 10px -8px black, -2px -2px 10px -8px ${color}, inset 2px 2px 2px -3px white, 0 0 10px -5px black, inset 0 0 4px -2px ` +
        color
      }
      {...{ ...styles }}
    >
      <Flex flexDir="column" alignItems="center" gap="4px">
        {Icon && <Icon size="30px" filter={`drop-shadow(0 0 2px ${color} )`} />}
        {/* <Text fontSize="7px" textShadow={`0px 0px 1px ${color}`}>
          {title}
        </Text> */}
      </Flex>
    </Button>
  );
};

const NavigationButton = ({ street }) => {
  const myPosition = useMyPosition();

  return (
    <ControlButton
      onClick={() =>
        window.open(getGoogleMapsDirURL(street)(myPosition), "_blank")
      }
      Icon={BiNavigation}
      title="Navigate"
      height="40px"
    />
  );
};
