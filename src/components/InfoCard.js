import { Flex, Text } from "@chakra-ui/react";

export default ({ Icon, value, title, bg = "transparant" }) => {
  return (
    <Flex
      h="50px"
      background={bg}
      color="var(--ternary-color-lightest)"
      justifyContent="center"
      alignItems="center"
      gap="0.5rem"
      width="100%"
    >
      <Icon size="28px" color="white" />

      <Flex flexDir={"column"} justifyContent="center" alignItems="flex-start">
        <Text
          fontSize={"20px"}
          fontWeight="700"
          p="0"
          lineHeight={"25px"}
          color="white"
        >
          {value?.length ? (
            <Flex>
              {value[0]}
              <Text fontSize="10px"> / {value[1]}</Text>
            </Flex>
          ) : (
            value
          )}
        </Text>
        <Text fontSize={"10px"} fontWeight="900" textTransform={"uppercase"}>
          {title}
        </Text>
      </Flex>
    </Flex>
  );
};
