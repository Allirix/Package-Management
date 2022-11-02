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
      h="45px"
      w="45px"
      minW="35px"
      background={pColor}
      borderRadius="0"
      // outline="1px solid rgb(240,240,240)"
      boxShadow="0 2px 2px rgb(240,240,240)"
    >
      <Flex
        background="rgb(0,20,0,0.8)"
        alignItems="center"
        justifyContent="center"
        minWidth="20px"
        minHeight="20px"
        borderRadius="0"
        p="1px"
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
