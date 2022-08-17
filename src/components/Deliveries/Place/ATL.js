import { Button, Flex } from "@chakra-ui/react";

export const atlStates = {
  0: { name: "ATL", color: "rgba(0,200,0,0.7)" },
  1: { name: "UNK", color: "rgba(200,100,0,0.7)" },
  2: { name: "SIG", color: "rgba(200,0,0,0.7)" },
};

const onATL = (atl) => {
  if (atl === undefined) return 0;
  if (atl === 2) return 0;
  return atl + 1;
};

export default function ATL({ atl, onClick }) {
  return (
    <Button
      onClick={() => onClick(onATL(atl))}
      boxShadow={`inset 0 0 4px ${atlStates[atl].color}, inset -2px -2px 2px -3px white, inset -2px -2px 3px -3px black`}
      fontWeight="700"
      color={atlStates[atl].color}
      fontSize={atl === 2 ? "12px" : "12px"}
      borderRadius="16px"
      variant="Whatsapp"
    >
      {atlStates[atl].name}
    </Button>
  );
}
