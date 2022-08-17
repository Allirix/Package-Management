import Parcel from "../Deliveries/Parcel/Parcel";
import { TYPE_IMAGES, popular, TYPE } from "./constants";
import { BasicForm, Button } from "./shared";

import { Stack, Flex, Button as ChButton } from "@chakra-ui/react";

const ParcelTypeStep = ({ list, title, onClickParcelSkip, skip }) => {
  const popularSelect = (obj) => (e) => {
    e.preventDefault();
    onClickParcelSkip(Object.keys(obj))(Object.values(obj))();
    skip(3);
  };

  const onClickTypeSize = (item) => (size) => (e) => {
    onClickParcelSkip(["type", "size"])([item, size])();
    skip(2);
  };

  return (
    <>
      <BasicForm title={title}></BasicForm>

      <Flex w="calc(100%)" gap="4px">
        <ButtonGroup onClick={onClickTypeSize("BAG")} item={"BAG"} />

        <ButtonGroup onClick={onClickTypeSize("BOX")} item={"BOX"} />
      </Flex>
      <PopularButtonGroup onClick={popularSelect} />
    </>
  );
};

export default ParcelTypeStep;

const ButtonGroup = ({ onClick, item }) => {
  const isBox = item === "BOX";
  const color = isBox ? "black" : "white";
  const bgColor = isBox ? "white" : "rgba(50,50,50,0.9)";
  const ParcelIcon = TYPE_IMAGES[item];
  return (
    <Stack w="100%" direction="row" alignItems={"center"} fontSize={"1.3rem"}>
      <Stack w="100%" gap="4px">
        {["L", "M", "S"].map((size, ii) => (
          <Button
            onClick={onClick(size)}
            color={color}
            Icon={ParcelIcon}
            background={bgColor}
            key={ii}
            boxShadow={`inset 1px 1px 3px -2px white`}
            margin={"0 0 0 0 !important"}
          >
            {size}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

const PopularButtonGroup = ({ onClick }) => {
  return (
    <Flex direction={"row"} w="100%" justifyContent="flex-end" wrap={"wrap"}>
      {popular.map((parcel) => (
        <ChButton
          height="80px"
          padding={"4px 2px"}
          background={"rgba(255,255,255,0.1)"}
          m="0"
        >
          <Parcel onClick={onClick(parcel)} {...{ ...parcel }} />
        </ChButton>
      ))}
    </Flex>
  );
};
