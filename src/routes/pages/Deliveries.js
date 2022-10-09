import { Flex, Button } from "@chakra-ui/react";
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
import DeliveryList from "../../components/Deliveries/DeliveryList";

// const DeliveryList = lazy(() =>
//   import("../../components/Deliveries/DeliveryList.js")
// );

export default function Deliveries() {
  const { undelivered, isEmpty, delivered } = useSortedDelivery();

  let location = useLocation();

  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) elem.scrollIntoView();
    }
  }, [location]);

  return (
    <ParcelPopupProvider>
      <Flex direction="column" w="800px" minW="100%" p="4px" gap="4px">
        {(undelivered?.length > 0 || delivered?.length > 0) && <Header />}
        {/* <Suspense fallback={<>Loading...</>}> */}
        <DeliveryList list={undelivered} canDeliver={true} />
        {/* </Suspense> */}

        <ParcelPopup />
      </Flex>
    </ParcelPopupProvider>
  );
}

const Header = ({ setShowDelivered, showDelivered }) => {
  const { dispatch } = useDeliveryDb();
  const { average, locations, parcels, pickups } = useStatCard();

  const eta = parcels[0] / average;

  const etaTime =
    new Date().getTime() + eta !== Infinity ? 1000 * 60 * 60 * eta : 0;

  const etaMessage =
    eta !== Infinity
      ? new Date(etaTime)
          ?.toLocaleString()
          ?.split(",")[1]
          ?.split(":")
          ?.slice(0, 2)
          ?.join(":") + " ETA"
      : "-";

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      w="100%"
      bg="var(--secondary-color)"
      p="4px"
      position="sticky"
      top="0px"
      left="0px"
      zIndex="100"
    >
      <InfoCard
        value={locations}
        title="Places"
        Icon={FiMapPin}
        helperText={
          Math.round((10 * parcels[1]) / locations[1]) / 10 + "/place"
        }
      />
      <InfoCard
        Icon={BsSquareHalf}
        value={parcels}
        title="Parcels"
        helperText={pickups + " Pickups"}
      />

      <InfoCard
        value={[Math.round(average * 10) / 10, "hr"]}
        title="Speed"
        Icon={BiRun}
        helperText="+/-10%"
      />
      <InfoCard
        value={[Math.round(10 * eta) / 10, "hrs"]}
        title="Time Left"
        Icon={BiRun}
        divider=" "
        helperText={etaMessage}
      />
    </Flex>
  );
};

const B = ({ onClick, Icon, color = "white" }) => (
  <Button onClick={onClick} background="var(--secondary-color)" h="50px" p="0">
    <Icon size="25px" color={color} />
  </Button>
);
