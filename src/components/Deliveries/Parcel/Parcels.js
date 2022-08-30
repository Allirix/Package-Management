import { Flex } from "@chakra-ui/react";
import { useMemo } from "react";
import Parcel from "./Parcel";
import { useParcelPopup } from "../Popup/PopupProvider";

export default ({ parcels, id }) => {
  const popup = useParcelPopup();

  return (
    <Flex
      className="parcels"
      gap="4px"
      justifyContent="flex-start"
      width="100%"
    >
      {parcels.map((parcel, index) => (
        <Parcel
          key={index}
          onClick={popup?.openPopup({ parcel, index, id })}
          {...{ ...parcel }}
        />
      ))}
    </Flex>
  );
};
