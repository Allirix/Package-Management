import { Flex } from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Parcel from "./Parcel";
import { useParcelPopup } from "../Popup/PopupProvider";
import { getUrlParamsFromPlace } from "../../../utils/hooks/utils";
// import { getUrlParamsFromPlace } from "../../../routes/pages/NewParcel";

export default ({ parcels, place }) => {
  const popup = useParcelPopup();
  const navigator = useNavigate();

  function newParcel() {
    return navigator(getUrlParamsFromPlace("/new/2", place));
  }

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
          onClick={popup?.openPopup({ parcel, index, id: place.id })}
          {...{ ...parcel }}
        />
      ))}
      <Parcel
        onClick={newParcel}
        color="rgba(50,50,50,0.1)"
        isPlus={true}
        type="PLUS"
        size=""
      />
    </Flex>
  );
};
