import { useState } from "react";
import { Button, Grid, Text } from "@chakra-ui/react";
import { hammingDistance } from "../../utils";
import { useDeliveryLocations } from "../../utils/providers/LocationProvider";
import { SingleInputForm, preventDefault } from "./shared";
import { MdOutlineChevronRight } from "react-icons/md";

const NameStep = ({ set }) => {
  const { locations } = useDeliveryLocations();
  const [value, setValue] = useState("");

  const displayedLocations = locations
    .map(toDistance(value))
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, 10);

  const onChange = (e) => setValue(e.target.value);

  const onSubmit = () => set(displayedLocations[0]);
  const onClick = (location) => () => set(location);

  return (
    <SingleInputForm
      onSubmit={onSubmit}
      input={{ onChange, value, helperText: "Enter a location" }}
    >
      {displayedLocations.map((location, key) => (
        <LocationButton key={key} onClick={onClick} location={location} />
      ))}
    </SingleInputForm>
  );
};
export default NameStep;

const toDistance = (name) => (e) => ({
  ...e,
  similarity: hammingDistance(e.name.slice(0, name.length), name),
});

export const LocationButton = ({ location, onClick }) => (
  <Button
    className="location-option"
    onClick={preventDefault(onClick(location))}
  >
    <Grid
      templateColumns={"110px 1fr 20px"}
      w="100%"
      gap="1rem"
      textAlign="left"
      fontSize="23px"
      alignItems="center"
    >
      <Text className="suburb-caption">{location.suburb}</Text>
      <Text className="name-caption">
        <span>{location.name} </span> {location.type}
      </Text>
      <MdOutlineChevronRight />
    </Grid>
  </Button>
);
