import { Button, Flex, Input } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useDeliveryLocations } from "../../utils/providers/LocationProvider";

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
      <Flex flexDirection="row" width="100%">
        {suburbNames.map((name, i) => (
          <Button
            key={i + "suburb-option"}
            onClick={() => setSelectedSuburb(name)}
            disabled={selectedSuburb === name}
            style={
              selectedSuburb === name ? { borderBottom: "2px solid blue" } : {}
            }
            w="100%"
          >
            {name}
          </Button>
        ))}
      </Flex>

      <Flex flexDirection="column" width="100%">
        <AddLocation add={add} selectedSuburb={selectedSuburb} />

        {suburbs[selectedSuburb]
          .sort((a, b) => a.name.localeCompare(b.name))
          .sort((a, b) => a.priority - b.priority)
          .map((location) => (
            <Location
              key={location.id + "location"}
              {...{ location, remove, edit }}
            />
          ))}
      </Flex>
    </Flex>
  );
}

const Location = ({ location }) => {
  const { remove, edit } = location;
  const onEdit = (key) => (e) => edit(key, e.target.value);
  const onRemove = () => remove();

  return (
    <Flex width="100%">
      <Input value={location.name} onChange={onEdit("name")} />
      <Input value={location.type} onChange={onEdit("type")} />
      <Button className="l-remove" onClick={onRemove}></Button>
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
    <Flex>
      {/* <input
        className="l-priority"
        value={state.priority}
        type="text"
        placeholder="n"
        onChange={onChange("priority")}
      /> */}
      <Input
        value={state.name}
        type="text"
        placeholder={`Add ${selectedSuburb} location...`}
        onChange={onChange("name")}
      />
      <Input
        value={state.type}
        type="text"
        placeholder="Type?"
        onChange={onChange("type")}
      />
      <Button
        onClick={onClick}
        style={{ background: "rgb(49, 49, 156)" }}
      ></Button>
    </Flex>
  );
};
