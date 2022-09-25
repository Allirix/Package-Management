import { getParcelShape, imgs, nonColor } from "../utils";
import { Flex, Text, Box } from "@chakra-ui/react";

export default ({
  color = "OTHER",
  type = "BAG",
  size = "U",
  count,
  onClick,
  isPlus = false,
}) => {
  const t = type?.toUpperCase();
  const c = color?.toUpperCase();
  const s = size?.toUpperCase();
  const isBag = true;

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
      borderRadius={"4px"}
      boxShadow={
        isPlus
          ? "inset -1px -1px 3px -2px white"
          : `inset 1px 1px 3px -2px white, 1px 1px 4px -3px white, 2px 2px 5px -2px black`
      }
      background={pColor}
      _hover={{
        transform: "scale(1.1)",
        cursor: "pointer",
        transition: "all 0.1s ease",
      }}
    >
      <Flex
        background={pType.contrastBg}
        alignItems={"center"}
        justifyContent={"center"}
        borderRadius="5px"
        padding="4px"
        boxShadow="inset 2px 2px 3px -3px white"
        gap={"2px"}
        overflow="auto"
        minWidth="40px"
        minHeight="40px"
      >
        <Flex
          flexDirection="column"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Flex alignItems={"center"} justifyContent={"center"}>
            <Icon color={pType.contrast} size={"20px"} />
            <Text
              fontSize={"20px"}
              lineHeight="25px"
              fontFamily={"'Open Sans', sans-serif"}
              zIndex={"99"}
              fontWeight="900"
              color={pType.contrast}
            >
              {s}
            </Text>
          </Flex>
          {count > 1 && (
            <Text
              fontSize={"15px"}
              lineHeight="15px"
              fontFamily={"'Open Sans', sans-serif"}
              zIndex={"99"}
              fontWeight="600"
              color={pType.contrast}
            >
              {`x${count}`}
            </Text>
          )}
        </Flex>
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
