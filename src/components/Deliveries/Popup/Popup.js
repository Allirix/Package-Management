import { Button, Flex, Select, Stack, Text } from "@chakra-ui/react";

import Parcel from "../Parcel/Parcel";
import { colors } from "../utils";
import { useParcelPopup } from "./PopupProvider";
import MainModal from "../../Modal";

export default () => {
  const { isOpen, closePopup } = useParcelPopup();

  if (!isOpen) return null;

  return (
    <MainModal
      isOpen={isOpen}
      closePopup={closePopup}
      Header={() => <Header />}
      Body={() => <Body />}
      Footer={() => <Footer />}
    />
  );
};

const Header = () => {
  const { selected } = useParcelPopup();
  const { type, size, color } = selected.parcel;

  return (
    <Text>
      {type} {color} {size}
    </Text>
  );
};

const Footer = () => {
  const { remove, save } = useParcelPopup();

  return (
    <Flex gap="4px">
      <ModalButton
        background="var(--primary-color)"
        onClick={remove}
        title="Remove"
      />
      <ModalButton
        background="var(--ternary-color)"
        onClick={save}
        title="Save"
      />
    </Flex>
  );
};

const Body = () => {
  const { selected, handleChange } = useParcelPopup();
  const { type, size, color } = selected.parcel;

  return (
    <Stack>
      <Select
        placeholder="Select Type"
        defaultValue={type}
        onChange={handleChange("type")}
      >
        {["BAG", "BOX"].map((option) => (
          <option value={option}>{option}</option>
        ))}
      </Select>
      <Select
        placeholder="Select Size"
        defaultValue={size}
        onChange={handleChange("size")}
      >
        {["L", "M", "S"].map((option) => (
          <option value={option}>{option}</option>
        ))}
      </Select>
      <Select
        placeholder="Select Color"
        defaultValue={color}
        onChange={handleChange("color")}
      >
        {colors.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </Select>
      <Flex justifyContent={"center"}>
        <Parcel {...{ type, size, color }} />
      </Flex>
    </Stack>
  );
};

const ModalButton = ({ background, title, onClick }) => (
  <Button
    h="50px"
    background={background}
    color="white"
    onClick={onClick}
    w="100%"
  >
    {title}
  </Button>
);
