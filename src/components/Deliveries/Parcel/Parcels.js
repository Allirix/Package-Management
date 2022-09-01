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
        onClick={() => navigator(getUrlParamsFromPlace("/new/2", place))}
        color="rgba(100,100,100, 0.3)"
        isPlus={true}
        type="PLUS"
        size=""
      />
    </Flex>
  );
};
