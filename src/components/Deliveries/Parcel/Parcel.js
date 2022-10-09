import { getParcelShape, imgs, nonColor } from "../utils";
import { Flex, Text, Box } from "@chakra-ui/react";

export default ({
  color = "OTHER",
  type = "BAG",
  size = "U",
  count,
  onClick,
}) => {
  const pColor =
    color.toUpperCase() in nonColor ? nonColor[color.toUpperCase()] : color;

  const Icon =
    type.toUpperCase() in imgs ? imgs[type.toUpperCase()] : imgs.OTHER;

  return (
    <Flex
      onClick={onClick}
      alignItems="center"
      justifyContent="center"
      h="60px"
      w="60px"
      background={pColor}
      borderRadius="4px"
    >
      <Flex
        background="rgb(0,0,0,0.5)"
        alignItems="center"
        justifyContent="center"
        minWidth="36px"
        minHeight="36px"
        borderRadius="4px"
        backdropFilter="blur(4px)"
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Flex alignItems="center" justifyContent="center">
            <Icon color="white" size="15px" />
            <Text
              fontSize="20px"
              lineHeight="20px"
              fontWeight="900"
              color="white"
            >
              {size.toUpperCase()}
            </Text>
          </Flex>
          {count > 1 && (
            <Text fontSize="14px" lineHeight="12px" color="white">
              {`x${count}`}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
