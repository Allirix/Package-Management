import { Button, Flex, Text } from "@chakra-ui/react";

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
      {...{ ...styles }}
    >
      <Flex flexDir="column" alignItems="center" gap="4px">
        {Icon && <Icon size="30px" />}
        {/* <Text fontSize="7px" textShadow={`0px 0px 1px ${color}`}>
          {title}
        </Text> */}
      </Flex>
    </Button>
  );
};
