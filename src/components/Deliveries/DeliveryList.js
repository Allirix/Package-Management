import { Flex, Button, ButtonGroup, Icon } from "@chakra-ui/react";
import { BiRun } from "react-icons/bi";
import { BsSquareHalf } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { BiReset } from "react-icons/bi";

import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

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
import FirstDelivery from "../../components/FirstDelivery";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Suspense } from "react";
import { lazy } from "react";

import Place from "./Place";

export default function DeliveryList({
  list,
  itemsPerPage = 20,
  selectedId = null,
  canDeliver = false,
}) {
  let location = useLocation();
  const [count, setCount] = useState([0, itemsPerPage - 1]);

  useEffect(() => {
    console.log(list);
    if (list.length < itemsPerPage) setCount([0, list.length - 1]);
    if (list.length >= itemsPerPage) setCount([0, itemsPerPage - 1]);
  }, [list]);

  function previous() {
    setCount((c) =>
      c[0] - itemsPerPage < 0
        ? [0, itemsPerPage - 1]
        : [c[0] - itemsPerPage, c[1] - itemsPerPage]
    );
  }

  function next() {
    setCount((c) =>
      c[1] + itemsPerPage > list.length - 1
        ? [c[0], list.length - 1]
        : [c[0] + itemsPerPage, c[1] + itemsPerPage]
    );
  }

  const filteredList = useMemo(
    () => list?.filter((e, i) => i >= count[0] && i <= count[1]),
    [list, count]
  );

  if (list?.length < 1) return <AddFirstParcel />;

  return (
    <>
      <Flex
        width="100%"
        justifyContent="space-between"
        color="var(--ternary-color)"
      >
        <Button
          onClick={() => previous()}
          leftIcon={<AiFillCaretLeft />}
          variant="WhatsApp"
          h="20px"
          disable={count[0] === 0}
        >
          {count[0] + 1}
        </Button>
        {list?.length}
        <Button
          onClick={() => next()}
          rightIcon={<AiFillCaretRight />}
          variant="WhatsApp"
          h="20px"
          disable={count[1] >= list?.length}
        >
          {count[1] + 1}
        </Button>
      </Flex>

      {filteredList?.map((street, id) => (
        <Place
          key={id}
          street={street}
          isHighlighted={location.hash === `#${street.id}`}
          showCheck={canDeliver}
        />
      ))}
    </>
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
      p="4px"
    >
      {/* <B
        onClick={() => dispatch("reset")}
        Icon={BiReset}
        color="var(--primary-color)"
      /> */}
      <InfoCard Icon={BsSquareHalf} value={parcels} title="Parcels" />
      <InfoCard value={locations} title="Places" Icon={FiMapPin} />
      <InfoCard
        value={[Math.round(average * 10) / 10, "hr"]}
        title="Speed"
        Icon={BiRun}
      />
      <B onClick={() => setShowDelivered((s) => !s)} Icon={FiDatabase}></B>
    </Flex>
  );
};

const B = ({ onClick, Icon, color = "white" }) => (
  <Button onClick={onClick} background="var(--secondary-color)" h="50px" p="0">
    <Icon size="25px" color={color} />
  </Button>
);
