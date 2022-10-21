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
  showControls = true,
}) {
  // hooks
  const location = useLocation();
  const [count, setCount] = useState([0, itemsPerPage - 1]);

  useEffect(() => {
    if (list.length < itemsPerPage) setCount([0, list.length - 1]);
    if (list.length >= itemsPerPage) setCount([0, itemsPerPage - 1]);
  }, [list]);

  const filteredList = useMemo(
    () =>
      showControls
        ? list?.filter((e, i) => i >= count[0] && i <= count[1])
        : list,
    [list, count]
  );

  //functions
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

  // dynamic rendering
  if (list?.length < 1) return <AddFirstParcel />;

  return (
    <>
      {showControls && (
        <Flex
          position="absolute"
          bottom="60px"
          width="100%"
          maxWidth="800px"
          justifyContent="space-between"
          background="white"
          color="blackAlpha.800"
          borderRadius="16px"
          boxShadow="0 1px 2px gray, inset 0 -1px 2px gray"
          fontWeight="900"
          zIndex="100"
          left="0"
        >
          <Button
            onClick={() => previous()}
            leftIcon={<AiFillCaretLeft />}
            variant="WhatsApp"
            h="20px"
            disable={(count[0] === 0).toString()}
          >
            {count[0] + 1}
          </Button>
          {list?.length}
          <Button
            onClick={() => next()}
            rightIcon={<AiFillCaretRight />}
            variant="WhatsApp"
            h="20px"
            disable={(count[1] >= list?.length).toString()}
          >
            {count[1] + 1}
          </Button>
        </Flex>
      )}
      <Flex flexDirection="column" gap="16px" w="100%" pb="32px">
        {filteredList?.map((street, id) => (
          <Place
            key={id}
            street={street}
            isHighlighted={location.hash === `#${street.id}`}
            showCheck={canDeliver}
          />
        ))}
      </Flex>
    </>
  );
}
