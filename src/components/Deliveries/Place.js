import { Button, Flex, Text } from "@chakra-ui/react";

import { toTime } from "./utils";

import Parcels from "./Parcel/Parcels";
import { Number, Info, Controls, Empty } from "./Place/index";
import ATL, { atlStates } from "./Place/ATL";

export default ({ street, remove, toggle, editATL }) => {
  if (!street?.number) return <Empty />;

  const {
    delivered,
    parcels,
    name,
    number,
    deliveredAt,
    notes,
    id,
    atl,
    distance,
    suburb,
  } = street;

  const showCheck =
    name && number && parcels.length > 0 && parcels.every((e) => e.color);

  return (
    <Flex
      className="delivery"
      alignItems="space-between"
      justifyContent="space-between"
      w="calc(100%)"
      background="var(--secondary-color-light)"
      p="12px"
    >
      <Flex flexDir="column" w="calc(100%)">
        <Flex className="street" gap="8px" justifyContent="flex-start">
          <Number number={number} />
          <Info name={name} notes={notes} distance={distance} suburb={suburb} />
        </Flex>
        <Flex
          alignItems="center"
          gap="4px"
          justifyContent="flex-start"
          h="72px"
        >
          {number && name && (
            <Flex
              flexDirection="column"
              w="50px"
              h="60px"
              flexDir="column"
              borderRadius={"5px"}
              boxShadow={
                `2px 2px 10px -8px black, -2px -2px 10px -8px ${atlStates[atl].color}, inset 2px 2px 2px -3px white, 0 0 10px -5px black, inset 0 0 4px -2px ` +
                atlStates[atl].color
              }
              p="4px"
              bg="rgba(0, 0, 0, 0.2)"
            >
              <ATL atl={atl} onClick={editATL} />

              <Text
                color="rgba(255,255,255,0.7)"
                fontSize="10px"
                fontWeight="600"
                textAlign="center"
              >
                {distance ? distance + "m" : "-"}
              </Text>
            </Flex>
          )}
          <Parcels parcels={parcels} id={id} />
        </Flex>
      </Flex>

      <Controls {...{ delivered, remove, showCheck, toggle, street }} />
    </Flex>
  );
};

const getBg = (distance) => {
  if (isNaN(distance) || distance == undefined) return "rgba(0,0,0,0.5)";
  if (distance < 50) return "lime";
  if (distance < 300) return "green";
  if (distance < 600) return "orange";
  if (distance < 1000) return "red";
  else return "red";
};
