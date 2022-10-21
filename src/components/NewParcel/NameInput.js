import { useState } from "react";
import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { hammingDistance } from "../../utils";
import { useDeliveryLocations } from "../../utils/providers/LocationProvider";
import { SingleInputForm, preventDefault } from "./shared";
import { MdOutlineChevronRight } from "react-icons/md";

import levenshtein from "js-levenshtein";

const NameStep = ({ set, setNumber, number }) => {
  const { locations } = useDeliveryLocations();
  const [value, setValue] = useState("");

  const place =
    value.split(" ").length > 1 ? value.split(" ").slice(1).join(" ") : value;

  const displayedLocations = locations
    .map(toDistance(place))
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, 10);

  function onChange(e) {
    setValue(e.target.value);
  }

  function setParams({ name, type, suburb }) {
    const number =
      value.split(" ").length > 1
        ? value.split(" ")[0].replace("/", "-").replace("\\", "-")
        : "";
    set({ name, type, suburb, number });
  }

  function onSubmit() {
    setParams(displayedLocations[0]);
  }

  const onClick =
    ({ name, type, suburb }) =>
    () =>
      setParams({ name, type, suburb });

  return (
    <SingleInputForm
      onSubmit={onSubmit}
      input={{ onChange, value, helperText: "Enter a location" }}
    >
      {place &&
        displayedLocations.map((location, key) => (
          <LocationButton
            key={key}
            onClick={onClick}
            location={location}
            text={place}
          />
        ))}
      <Flex p="16px">#ToDO: Add Popular Locations here</Flex>
    </SingleInputForm>
  );
};
export default NameStep;

const toDistance = (name) => (e) => ({
  ...e,
  similarity: hammingDistance(e.name.slice(0, name.length), name),
});

export const LocationButton = ({ location, onClick, text }) => {
  const a = location.name.split("").map((e, i) => {
    return text.length <= i
      ? "rgba(255,255,255,0.8)"
      : e === text[i]
      ? "white"
      : "red";
  });

  return (
    <Button
      height="50px"
      onClick={preventDefault(onClick(location))}
      color="black"
    >
      <Grid
        templateColumns={"110px 1fr 20px"}
        w="100%"
        gap="1rem"
        textAlign="left"
        fontSize="23px"
        alignItems="center"
        background=""
      >
        <Text textTransform="uppercase" color="green.800" fontSize="14px">
          {location.suburb}
        </Text>
        <Flex
          textTransform="uppercase"
          justifyContent="flex-start"
          alignItems="center"
        >
          {location.name.split("").map((e, i) => (
            <Text
              color={
                text.length <= i
                  ? "blackAlpha.600"
                  : e.toLowerCase() === text[i]?.toLowerCase()
                  ? "blackAlpha.800"
                  : "red"
              }
            >
              {e}
            </Text>
          ))}
          <Text ml="4px" fontSize="12px" opacity="0.7">
            {location.type}
          </Text>
        </Flex>
        <MdOutlineChevronRight color="green.800" />
      </Grid>
    </Button>
  );
};
