import { Flex, Text } from "@chakra-ui/react";

export default function Info({ name, notes, children, suburb }) {
  return (
    <Flex direction="column" w="100%" textAlign="left">
      <Text
        color="rgba(255,255,255,0.9)"
        textTransform="uppercase"
        fontSize="18px"
        fontWeight="600"
      >
        {name}
      </Text>
      <Text
        color="rgba(255,255,255,0.7)"
        textTransform="uppercase"
        fontSize="8px"
      >
        {suburb}
      </Text>
      {notes && (
        <Text
          color="rgba(255,255,255,0.7)"
          textTransform="uppercase"
          fontSize="10px"
        >
          {notes}
        </Text>
      )}
      {children}
    </Flex>
  );
}
