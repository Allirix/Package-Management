import { getParcelShape, imgs, nonColor } from "../utils";
import { Flex, Text, Box } from "@chakra-ui/react";

export default ({ color, type, size, onClick }) => {
  const t = type?.toUpperCase();
  const c = color?.toUpperCase();
  const s = size?.toUpperCase();
  const isBag = t === "BAG";

  const pColor = c in nonColor ? nonColor[c] : color;
  const pType = {
    contrast: isBag ? "white" : "black",
    contrastBg: isBag ? "rgb(0,0,0,0.6)" : "rgb(255,255,255,0.5)",
    backgroundColor: isBag ? "rgba(100,50,0,0.8)" : "rgba(255,255,255,0.8)",
  };
  const Icon = t in imgs ? imgs[t] : imgs.OTHER;

  return (
    <Flex
      onClick={onClick}
      alignItems={"center"}
      justifyContent={"center"}
      h="60px"
      w="60px"
      padding="0px"
      gap={"4px"}
      borderRadius={"5px"}
      boxShadow={`inset 1px 1px 3px -2px white, 0px 0px 4px ${pColor}, 2px 2px 5px -2px black`}
      background={pColor}
    >
      <Flex
        background={pType.contrastBg}
        alignItems={"center"}
        justifyContent={"center"}
        borderRadius="5px"
        padding="4px"
        boxShadow="inset 2px 2px 3px -1px white, 0px px 5px black"
        gap={"2px"}
      >
        <Icon color={pType.contrast} size={"22px"} />
        <Text
          fontSize={"25px"}
          lineHeight="0px"
          fontFamily={"'Open Sans', sans-serif"}
          zIndex={"99"}
          fontWeight="900"
          color={pType.contrast}
        >
          {s}
        </Text>
      </Flex>
    </Flex>
  );
};

export const ParcelShape =
  (backgroundColor, type) =>
  ({ ...style }) => {
    return (
      <Box
        background={backgroundColor}
        boxShadow="inset 2px 2px 4px -3px white"
        dropShadow={`1px 1px 5px ${backgroundColor}`}
        w="30px"
        h="30px"
        clipPath={getParcelShape(type)}
        {...style}
      ></Box>
    );
  };
