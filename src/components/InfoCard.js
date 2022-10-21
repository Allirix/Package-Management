import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";

export default ({
  Icon,
  value,
  title,
  bg = "green.800",
  divider = "/",
  helperText = "",
}) => {
  return (
    <Flex
      color="white"
      textAlign="center"
      background="white"
      flexDirection="column"
      borderRadius="8px"
      m="4px 0"
      w="150px"
      boxShadow="0 1px 2px 0px gray, inset 0 1px 2px gray"
      overflow="hidden"
    >
      <Text
        color="whiteAlpha.900"
        textTransform="uppercase"
        background={bg}
        fontWeight="900"
        fontSize="12px"
      >
        {title}
      </Text>
      <Text fontSize="20px" color="blackAlpha.800" fontWeight="900">
        {value[0]}
        <strong style={{ fontSize: "14px", color: "rgba(0,0,0,0.6)" }}>
          {divider}
          {value[1]}
        </strong>
      </Text>
      <Text
        fontWeight="600"
        color="blackAlpha.700"
        fontSize="12px"
        textTransform="uppercase"
      >
        {helperText}
      </Text>
    </Flex>
  );
};
