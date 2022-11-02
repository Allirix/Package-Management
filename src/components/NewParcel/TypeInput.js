import Parcel from "../Deliveries/Parcel/Parcel";
import { TYPE_IMAGES, popular, TYPE } from "./constants";
import { BasicForm, BigInput, Button } from "./shared";

import { Stack, Flex, Button as ChButton, Input } from "@chakra-ui/react";
import { useState } from "react";

const ParcelTypeStep = ({ title, onClick, skip }) => {
  const [number, setNumber] = useState("");
  const popularSelect = (obj) => (e) => {
    e.preventDefault();
    onClick("parcels", 3)(JSON.stringify(obj));
  };

  const onClickTypeSize = (type) => (size, count) => (e) => {
    onClick("parcels", 2)(JSON.stringify({ type, size, count }));
  };

  return (
    <>
      <BasicForm title={title}></BasicForm>
      <BigInput
        inputMode="numeric"
        autoFocus={false}
        placeholder="number of parcels"
        value={number === "" ? "" : number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <Flex w="calc(100%)" gap="4px" padding="8px">
        <ButtonGroup
          onClick={onClickTypeSize("BAG")}
          item={"BAG"}
          count={number === "" ? 1 : number}
        />
        <ButtonGroup
          onClick={onClickTypeSize("BOX")}
          item={"BOX"}
          count={number === "" ? 1 : number}
        />
      </Flex>
      <PopularButtonGroup
        onClick={popularSelect}
        count={number === "" ? 1 : number}
      />
    </>
  );
};

export default ParcelTypeStep;

const ButtonGroup = ({ onClick, item, count }) => {
  const isBox = item === "BOX";
  const color = isBox ? "black" : "white";
  const bgColor = isBox ? "white" : "rgba(50,50,50,0.9)";
  const ParcelIcon = TYPE_IMAGES[item];
  return (
    <Stack w="100%" direction="row" alignItems={"center"} fontSize={"1.3rem"}>
      <Stack w="100%" gap="4px">
        {["L", "M", "S"].map((size) => (
          <Button
            onClick={onClick(size, count)}
            color={color}
            icon={ParcelIcon}
            background={bgColor}
            key={size}
            // boxShadow={`inset 1px 1px 3px -2px white`}
            margin={"0 0 0 0 !important"}
          >
            {size}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

const PopularButtonGroup = ({ onClick, count }) => {
  return (
    <Flex
      direction={"row"}
      w="100%"
      justifyContent="flex-end"
      wrap={"wrap"}
      p="0 8px 150px 8px"
      gap="4px"
    >
      {popular.map((parcel, i) => (
        <ChButton
          height="70px"
          w="calc((100% - 32px) / 6)"
          padding="0"
          background="gray.200"
          m="0"
          key={i}
        >
          <Parcel onClick={onClick({ ...parcel, count })} {...{ ...parcel }} />
        </ChButton>
      ))}
    </Flex>
  );
};
