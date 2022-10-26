import { useState } from "react";
import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { hammingDistance } from "../../utils";
import { useDeliveryLocations } from "../../utils/providers/LocationProvider";
import { SingleInputForm, preventDefault } from "./shared";
import { MdOutlineChevronRight } from "react-icons/md";

import levenshtein from "js-levenshtein";
import { useDeliveryDb } from "../../utils/providers";

const NameStep = ({ set }) => {
  const { locations } = useDeliveryLocations();
  const { selected } = useDeliveryDb();
  const [value, setValue] = useState("");

  const place =
    value.split(" ").length > 1 ? value.split(" ").slice(1).join(" ") : value;

  const displayedLocations = locations
    .map(toDistance(place))
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, 10);
  const number =
    value.split(" ").length > 1
      ? value.split(" ")[0].replace("/", "-").replace("\\", "-")
      : "";
  const popularLocations = selected
    .filter((e) => e.parcelsArchive)
    .sort(
      (a, b) =>
        Object.keys(b.parcelsArchive).length -
        Object.keys(a.parcelsArchive).length
    )
    .filter((e) => !number || e.number == number)
    .slice(0, 12);
  // .map(({ number, name, type, suburb, parcelsArchive }) => ({
  //   number,
  //   name,
  //   type,
  //   suburb,
  //   parcelsArchive: Object.keys(parcelsArchive).length,
  // }));

  console.log(popularLocations, number);

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
            location={{ ...location, number }}
            text={place}
          />
        ))}
      <Flex
        gap="8px"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        w="100%"
      >
        {popularLocations.map((e, i) => (
          <LocationButton
            text=""
            key={i}
            onClick={() => onClick(e)}
            location={e}
          />
        ))}
      </Flex>
    </SingleInputForm>
  );
};
export default NameStep;

function PopularLocation({
  number,
  name,
  type,
  suburb,
  parcelsArchive,
  onClick,
}) {
  return (
    <Button
      width="30%"
      height="100px"
      p="0"
      variant="unstyled"
      minWidth="50px"
      onClick={onClick}
    >
      <Flex
        width="100%"
        minWidth="50px"
        height="100px"
        bg="green.800"
        alignItems="center"
        justifyContent="center"
        fontSize="14px"
        flexDirection="column"
        fontFamily='"Open Sans"'
        fontWeight="900"
        color="white"
        borderRadius="16px"
      >
        <Text fontSize="20px" fontWeight="900">
          {number}
        </Text>
        <Text fontWeight="600">{name}</Text>
        <Flex>{parcelsArchive}</Flex>
      </Flex>
    </Button>
  );
}

const toDistance = (name) => (e) => ({
  ...e,
  similarity: hammingDistance(e.name.slice(0, name.length), name),
});

export const LocationButton = ({ number, location, onClick, text }) => {
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
      w="100%"
    >
      <Grid
        templateColumns={"100px 20px 1fr 20px"}
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

        <Text
          textTransform="uppercase"
          color="red.500"
          fontSize="18px"
          fontWeight="900"
        >
          {location.number}
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
