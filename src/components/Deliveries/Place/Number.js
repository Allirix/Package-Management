import { Flex, Text } from "@chakra-ui/react";

export default ({ number }) => {
  return (
    <Text
      fontSize="32px"
      color="var(--ternary-color-lightest)"
      fontWeight="600"
      display="inline-block"
    >
      {number}
    </Text>
  );
};
