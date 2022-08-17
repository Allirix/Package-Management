import { Button, Flex, Text } from "@chakra-ui/react";

export const ControlButton = ({
  onClick,
  Icon,
  title,
  color = "var(--ternary-color-lightest)",
  background = "var(--secondary-color)",
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
