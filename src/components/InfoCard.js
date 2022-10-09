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
  bg = "transparant",
  divider = "/",
  helperText = "",
}) => {
  return (
    <Stat color="white" textAlign="center">
      <StatLabel color="var(--ternary-color)">{title}</StatLabel>
      <StatNumber>
        {value[0]}
        <strong style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>
          {divider}
          {value[1]}
        </strong>
      </StatNumber>
      <StatHelpText opacity="0.6" color="var(--ternary-color)">
        {helperText}
      </StatHelpText>
    </Stat>
  );

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
        <Flex
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
        </Flex>
        <Text fontSize={"10px"} fontWeight="900" textTransform={"uppercase"}>
          {title}
        </Text>
      </Flex>
    </Flex>
  );
};
