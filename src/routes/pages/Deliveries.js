import { Flex, Button } from "@chakra-ui/react";
import { BiRun } from "react-icons/bi";
import { BsSquareHalf } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { BiReset } from "react-icons/bi";

import { ImShrink } from "react-icons/im";
import { FaExpandArrowsAlt } from "react-icons/fa";

import AddFirstParcel from "../../components/Deliveries/FirstDelivery";
import "../../components/Deliveries/DisplayStreets.css";

import ParcelPopup from "../../components/Deliveries/Parcel/Popup";
import { ParcelPopupProvider } from "../../components/Deliveries/Parcel/PopupProvider";
import InfoCard from "../../components/Home/InfoCard";
import useStatCard from "../../components/Home/useStatCard";
import { useMemo, useState } from "react";
import { useDeliveryDb, useSortedDelivery } from "../../utils/providers";
import Place from "../../components/Deliveries/Place";

export default function Deliveries() {
  const { dispatch } = useDeliveryDb();
  const { undelivered, isEmpty, delivered } = useSortedDelivery();

  const [showDelivered, setShowDelivered] = useState(false);

  // memoise list to ignore rerendering from parent updates
  const suburbList = useMemo(() => {
    const values = showDelivered ? delivered : undelivered;
    return values.map((street) => (
      <Place
        key={street.id}
        i={street.id}
        street={street}
        remove={() => dispatch("remove", street.id)}
        toggle={() => dispatch("toggle", street.id)}
        editATL={(value) =>
          dispatch("edit", { id: street.id, key: "atl", value })
        }
      />
    ));
  }, [undelivered, delivered, showDelivered, dispatch]);

  console.log(showDelivered);

  if (isEmpty && !showDelivered)
    return (
      <Flex flexDirection="column" w="100%" h="100vh">
        <Header
          setShowDelivered={setShowDelivered}
          showDelivered={showDelivered}
        />
        <AddFirstParcel />
      </Flex>
    );

  return (
    <ParcelPopupProvider>
      <Flex direction="column" w="800px" minW="100%">
        <Header
          setShowDelivered={setShowDelivered}
          showDelivered={showDelivered}
        />
        {suburbList}
        <ParcelPopup />
      </Flex>
    </ParcelPopupProvider>
  );
}

const Header = ({ setShowDelivered, showDelivered }) => {
  const { dispatch } = useDeliveryDb();
  const { average, locations, parcels } = useStatCard();

  return (
    <Flex
      justifyContent="space-between"
      alignItems="space-between"
      w="100%"
      bg="var(--secondary-color)"
      borderBottom="1px solid rgba(255,255,255,0.4)"
      p="12px"
    >
      <B
        onClick={() => dispatch("reset")}
        Icon={BiReset}
        color="var(--primary-color)"
      />
      <InfoCard Icon={BsSquareHalf} value={parcels} title="Parcels" />
      <InfoCard value={locations} title="Places" Icon={FiMapPin} />
      <InfoCard value={[average, "hr"]} title="Speed" Icon={BiRun} />
      <B
        onClick={() => setShowDelivered((s) => !s)}
        Icon={showDelivered ? ImShrink : FaExpandArrowsAlt}
      ></B>
    </Flex>
  );
};

const B = ({ onClick, Icon, color = "white" }) => (
  <Button
    onClick={onClick}
    background="var(--secondary-color)"
    h="50px"
    p="0"
    boxShadow={
      `2px 2px 10px -8px black, -2px -2px 10px -8px ${color}, inset 2px 2px 2px -3px white, 0 0 10px -5px black, inset 0 0 4px -2px ` +
      color
    }
  >
    <Icon size="25px" color={color} />
  </Button>
);
