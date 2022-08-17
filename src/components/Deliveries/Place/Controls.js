import { RiCloseFill } from "react-icons/ri";

import { Button, Flex } from "@chakra-ui/react";
import { BiNavigation } from "react-icons/bi";
import { BsArrowReturnLeft, BsFillCheckCircleFill } from "react-icons/bs";
import { getGoogleMapsDirURL } from "../utils";
import { useMyPosition } from "../../../utils/providers";
import { ControlButton } from "../ControlButton";

export default function Controls({
  delivered,
  showCheck,
  toggle,
  remove,
  street,
}) {
  return (
    <Flex
      alignItems="center"
      justifyContent="flex-end"
      gap="8px"
      color="white"
      borderRadius={"4px"}
      flexDir="column"
    >
      {!showCheck ? null : (
        <>
          {delivered && (
            <ControlButton
              onClick={remove}
              Icon={RiCloseFill}
              title="Remove"
              color="var(--primary-color)"
            />
          )}
          {/* <ControlButton
            onClick={() => alert("Not yet implemented")}
            Icon={BiEdit}
            title="Notes"
            color="blue.300"
          /> */}
          {!delivered && (
            <NavigationButton openURL={getGoogleMapsDirURL(street)} />
          )}

          <ControlButton
            onClick={toggle}
            Icon={!delivered ? BsFillCheckCircleFill : BsArrowReturnLeft}
            title={!delivered ? "Deliver" : "Return"}
            color="white"
          />
        </>
      )}
    </Flex>
  );
}

const NavigationButton = ({ openURL }) => {
  const myPosition = useMyPosition();

  return (
    <ControlButton
      onClick={() => window.open(openURL(myPosition), "_blank")}
      Icon={BiNavigation}
      title="Navigate"
    />
  );
};

export const MiniButton = ({ onClick, children, className, ...style }) => {
  return (
    <Button
      className={className}
      onClick={onClick}
      h="60px"
      width="60px"
      padding={0}
      boxShadow="inset 1px 1px 3px -2px white"
      {...{ style }}
    >
      {children}
    </Button>
  );
};
