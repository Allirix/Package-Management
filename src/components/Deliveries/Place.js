import { Button, Flex, Text } from "@chakra-ui/react";

import Parcels from "./Parcel/Parcels";

import { atlStates } from "../../data/constants";
import Controls from "./Controls";
import { useDeliveryDb } from "../../utils/providers";

export default ({
  street: place,
  editATL,
  show = true,
  isHighlighted = false,
  showCheck = true,
  onComplete = () => {},
}) => {
  const { dispatch } = useDeliveryDb();

  if (!place?.number && !place?.name) return <EmptyPlace />;

  return (
    <Flex
      // className="delivery"
      alignItems="space-between"
      justifyContent="space-between"
      w="calc(100%)"
      background="white"
      id={place.id}
      borderRadius="8px"
      border={isHighlighted ? "1px solid green" : ""}
      overflow="hidden"
      minHeight="100px"
    >
      <Flex flexDir="column" w="calc(100%)">
        <LocationInformation {...{ ...place }} />
        <DeliveryInformation {...{ ...place, editATL, place }} />
      </Flex>
      {show && (
        <Controls
          street={place}
          showCheck={place.parcels.length > 0 && showCheck}
          onComplete={onComplete}
        />
      )}
    </Flex>
  );
};

const EmptyPlace = () => (
  <Flex
    className="delivery"
    h="141px"
    justifyContent="center"
    alignItems="center"
    color="rgb(255, 255,255,0.7)"
  >
    <h2>FILL FORM TO POPULATE STREET</h2>
  </Flex>
);
const LocationInformation = ({
  number,
  name,
  suburb,
  notes,
  atl,
  editATL,
  id,
  distance,
  parcels,
  createdAt,
  deliveredAt,
}) => {
  const isPickup = parcels.some((e) => e.type === "PICKUP");
  const isShop = number === "";

  return (
    <Flex
      className="street"
      gap="12px"
      justifyContent="flex-start"
      flexDirection="row"
      justifyItems="center"
      alignItems="center"
      background={isPickup ? "orange.800" : isShop ? "blue.800" : "green.800"}
      height="40px"
      p="12px"
    >
      <Text
        fontSize="20px"
        color="white"
        fontWeight="600"
        display="inline-block"
      >
        {number.replace("-", "/")}
      </Text>
      <Flex direction="column" w="100%" textAlign="left">
        <Flex gap="4px" alignItems="center">
          <Text
            color="whiteAlpha.900"
            textTransform="uppercase"
            fontSize="16px"
            fontWeight="600"
          >
            {name}
          </Text>
          {distance && <ATL atl={atl} id={id} editATL={editATL} />}
        </Flex>

        <Flex color="whiteAlpha.700" fontSize="10px" gap="4px" mt="-5px">
          <Text fontWeight="900" textTransform="uppercase">
            {suburb}
          </Text>
          {createdAt && (
            <Text
              textTransform="uppercase"
              fontWeight="604"
              color="whiteAlpha.700"
            >
              {new Date(deliveredAt ? deliveredAt : createdAt)
                .toLocaleTimeString()
                .split(":")
                .slice(0, 2)
                .join(":")}
            </Text>
          )}
          {notes && (
            <Text textTransform="uppercase" fontWeight="900" color="red.200">
              {notes}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const DeliveryInformation = ({
  editATL,
  name,
  number,
  atl,
  distance,
  parcels,
  place,
  id,
}) => {
  return (
    <Flex
      alignItems="center"
      gap="4px"
      justifyContent="flex-start"
      p="0 16px"
      h="100%"
      overflowX="auto"
    >
      <Parcels parcels={parcels} place={place} />
    </Flex>
  );
};

function ATL({ atl, id, editATL = null }) {
  const { dispatch } = useDeliveryDb();
  const onClick = editATL
    ? () => editATL((atl + 1) % 3)
    : () => dispatch("edit", { id, key: "atl", value: (atl + 1) % 3 });
  return (
    <Button
      onClick={onClick}
      fontWeight="700"
      background={atlStates[atl].color}
      fontSize="10px"
      borderRadius="16px"
      variant="Whatsapp"
      p="0"
      m="0"
      height="15px"
      color="white"
    >
      {atlStates[atl].name}
    </Button>
  );
}
