import { Flex, Button, Select } from "@chakra-ui/react";
import { BiRun } from "react-icons/bi";
import { BsSquareHalf } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { BiReset } from "react-icons/bi";

import { ImShrink } from "react-icons/im";
import { FaExpandArrowsAlt } from "react-icons/fa";

import AddFirstParcel from "../../components/FirstDelivery";
import "../../components/Deliveries/Delivery.css";

import { FiDatabase } from "react-icons/fi";

import ParcelPopup from "../../components/Deliveries/Popup/Popup";
import { ParcelPopupProvider } from "../../components/Deliveries/Popup/PopupProvider";
import InfoCard from "../../components/InfoCard";
import useStatCard from "../../utils/hooks/useStatCard";
import { useMemo, useState } from "react";
import { useDeliveryDb, useSortedDelivery } from "../../utils/providers";
import Place from "../../components/Deliveries/Place";
import FirstDelivery from "../../components/FirstDelivery";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Suspense } from "react";
import { lazy } from "react";

const DeliveryList = lazy(() =>
  import("../../components/Deliveries/DeliveryList.js")
);

export default function History() {
  const { sorted } = useSortedDelivery();
  const [date, setDate] = useState(new Date().toLocaleDateString());

  const dates = sorted.reduce((acc, location) => {
    if (
      !("parcelsArchive" in location) ||
      Object.keys(location?.parcelsArchive)?.length < 1
    )
      return acc;

    const parcelTimes = Object.keys(location.parcelsArchive);
    const parcelDates = parcelTimes.map((e) =>
      new Date(parseInt(e)).toLocaleDateString()
    );

    parcelDates.forEach((parcelDate, i) => {
      if (!(parcelDate in acc)) acc[parcelDate] = [];
      acc[parcelDate] = acc[parcelDate].concat({
        ...location,
        parcels: location.parcelsArchive[parcelTimes[i]],
      });
    });
    return acc;
  }, {});

  return (
    <ParcelPopupProvider>
      <Flex direction="column" maxWidth="800px" minW="calc(100% - 1px)" m="2px">
        <Select
          onChange={(e) => setDate(e.target.value)}
          color="white"
          border="none"
          h="60px"
        >
          {Object.keys(dates).length > 0 &&
            Object.keys(dates).map((e) => (
              <option style={{ color: "white", background: "black" }}>
                {e}
              </option>
            ))}
        </Select>
        <Suspense fallback={<>Loading...</>}>
          <DeliveryList list={date in dates ? dates[date] : []} />
        </Suspense>

        <ParcelPopup />
      </Flex>
    </ParcelPopupProvider>
  );
}
