import { nonColor } from "./constants";
import { BasicForm, Button } from "./shared";
import { Flex } from "@chakra-ui/react";

const ParcelStep = ({ list, title, onClick }) => {
  const up = (e) => e.toUpperCase();

  return (
    <>
      <BasicForm title={title}></BasicForm>
      <Flex wrap="wrap" gap="4px">
        {list.map((item, i) => (
          <Button
            key={up(item) + i}
            onClick={onClick(item)}
            width={"calc(50% - 2px)"}
            background={up(item) in nonColor ? nonColor[up(item)] : item}
          >
            {up(item)}
          </Button>
        ))}
      </Flex>
    </>
  );
};

export default ParcelStep;
