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
      className="delivery"
      alignItems="space-between"
      justifyContent="space-between"
      w="calc(100%)"
      background="var(--secondary-color-light)"
      p="12px"
      id={place.id}
      backdropFilter="blur( 4px )"
      borderRadius="8px"
      border={
        isHighlighted
          ? "1px solid green"
          : "1px solid rgba( 255, 255, 255, 0.05 )"
      }
      // minHeight="3000px"
    >
      <Flex flexDir="column" w="calc(100%)" overflowX="auto">
        <LocationInformation {...{ ...place }} />
        <DeliveryInformation {...{ place, editATL }} />
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

const LocationInformation = ({ number, name, suburb, notes }) => (
  <Flex
    className="street"
    gap="8px"
    justifyContent="flex-start"
    flexDirection="row"
    justifyItems="center"
    alignItems="center"
  >
    <Text
      fontSize="32px"
      color="var(--ternary-color-lightest)"
      fontWeight="600"
      display="inline-block"
    >
      {number}
    </Text>
    <Flex direction="column" w="100%" textAlign="left">
      <Text
        color="rgba(255,255,255,0.9)"
        textTransform="uppercase"
        fontSize="18px"
        fontWeight="600"
        lineHeight="36px"
        mt="-8px"
      >
        {name}
      </Text>
      <Text
        color="rgba(255,255,255,0.7)"
        textTransform="uppercase"
        fontSize="8px"
        mt="-8px"
      >
        {suburb}
      </Text>
      {notes && (
        <Text
          color="rgba(255,255,255,0.7)"
          textTransform="uppercase"
          fontSize="12px"
          fontWeight="900"
          color="var(--primary-color)"
        >
          {notes}
        </Text>
      )}
    </Flex>
  </Flex>
);

const DeliveryInformation = ({ editATL, place }) => {
  const { name, number, atl, distance, parcels } = place;
  return (
    <Flex
      alignItems="center"
      gap="4px"
      justifyContent="flex-start"
      h="72px"
      p="4px"
      m="4px"
      borderRadius="8px"
      border="1px solid rgba(255,255,255,0.05)"
    >
      {place.id && place.parcels?.length > 0 && (
        <Flex
          flexDirection="column"
          w="50px"
          h="60px"
          flexDir="column"
          borderRadius={"5px"}
          // boxShadow={
          //   `2px 2px 10px -8px black, -2px -2px 10px -8px ${atlStates[atl].color}, inset 2px 2px 2px -3px white, 0 0 10px -5px black, inset 0 0 4px -2px ` +
          //   atlStates[atl].color
          // }
          p="4px"
          bg="rgba(0, 0, 0, 0.2)"
        >
          <ATL atl={atl} id={place.id} editATL={editATL} />
          <Text
            color="rgba(255,255,255,0.7)"
            fontSize="8px"
            fontWeight="600"
            textAlign="center"
          >
            {distance ? distance + "m" : "-"}
          </Text>
        </Flex>
      )}
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
      // boxShadow={`inset 0 0 4px ${atlStates[atl].color}, inset -2px -2px 2px -3px white, inset -2px -2px 3px -3px black`}
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
