import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useDeliveryLocations } from "../../utils/providers/LocationProvider";

import { RiCloseFill, RiCheckFill } from "react-icons/ri";

const suburbNames = ["Mitchelton", "Upper Kedron", "Gaythorne", "Keperra"];

export default function Street() {
  const [selectedSuburb, setSelectedSuburb] = useState(suburbNames[0]);
  const { locations, remove, edit, add } = useDeliveryLocations();

  const suburbs = useMemo(
    () =>
      locations.reduce((acc, l, id) => {
        const poi = {
          ...l,
          id,
          remove: remove(id),
          edit: edit(id),
        };
        if (l.suburb in acc) acc[l.suburb] = acc[l.suburb].concat(poi);
        else acc[l.suburb] = [poi];
        return acc;
      }, {}),
    [locations, remove, edit]
  );
  return (
    <Flex flexDirection="column" width="100%">
      <Flex flexDirection="row" width="100%" background="green.800">
        {suburbNames.map((name, i) => (
          <LocationTitle
            key={name}
            name={name}
            onClick={() => setSelectedSuburb(name)}
            disabled={selectedSuburb === name}
          />
        ))}
      </Flex>

      <Flex flexDirection="column" width="100%" gap="4px" p="4px">
        <AddLocation add={add} selectedSuburb={selectedSuburb} />
        {suburbs[selectedSuburb]
          .sort((a, b) => a.name.localeCompare(b.name))
          .sort((a, b) => a.priority - b.priority)
          .map((location, i) => (
            <Location key={i} {...{ location, remove, edit, i }} />
          ))}
      </Flex>
    </Flex>
  );
}

const Location = ({ location, i }) => {
  const { remove, edit } = location;
  const onEdit = (key) => (e) => edit(key, e.target.value);
  const onRemove = () => remove();

  return (
    <Flex width="100%" gap="4px" color="black" alignItems="center">
      <Text pr="8px" color="black" minW="40px" textAlign="center">
        {i}
      </Text>
      <Input
        value={location.name}
        onChange={onEdit("name")}
        borderRadius="16px"
        h="50px"
        border="1px solid rgba(0,0,0,0.3) !important"
      />
      <Input
        value={location.type}
        onChange={onEdit("type")}
        borderRadius="16px"
        w="20%"
        h="50px"
        minW="40px"
        border="1px solid rgba(0,0,0,0.3) !important"
        textAlign="center"
      />
      <Button
        onClick={onRemove}
        variant="solid"
        type="button"
        colorScheme="red"
        fontSize="25px"
        p="0"
        h="50px"
        w="70px"
      >
        <RiCloseFill />
      </Button>
    </Flex>
  );
};
const defaultState = {
  suburb: "Mitchelton",
  name: "",
  type: "",
  priority: "",
  full: "",
};
const AddLocation = ({ add, selectedSuburb }) => {
  const [state, setState] = useState(defaultState);

  const onChange = (key) => (e) =>
    setState((s) => ({ ...s, [key]: e.target.value }));
  // const onChange = (key) => (e) => edit(key, e.target.value, i);
  const onClick = () => {
    if (state.name.length > 0) {
      add(selectedSuburb, state);
      setState(defaultState);
    }
  };

  return (
    <Flex gap="8px" color="black">
      <Input
        value={state.name}
        type="text"
        placeholder={`Add ${selectedSuburb} location...`}
        onChange={onChange("name")}
        h="70px"
        borderRadius="16px"
        border="1px solid rgba(0,0,0,0.3) !important"
      />
      <Input
        value={state.type}
        type="text"
        placeholder="Type?"
        onChange={onChange("type")}
        h="70px"
        variant="outline"
        w="15%"
        borderRadius="16px"
        minWidth="70px"
        borderRadius="16px"
        border="1px solid rgba(0,0,0,0.3) !important"
        textAlign="center"
      />
      <Button
        onClick={onClick}
        colorScheme="blue"
        w="80px"
        h="70px"
        disabled={state.name.length === 0}
      >
        <RiCheckFill size="30px" />
      </Button>
    </Flex>
  );
};

const LocationTitle = ({ name, ...props }) => {
  return (
    <Button
      w="25%"
      {...{ ...props }}
      variant="unstyled"
      color="white"
      h="60px"
      borderRadius="0"
    >
      {name}
    </Button>
  );
};
