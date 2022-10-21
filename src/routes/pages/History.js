import { Flex, Button, Select, Box } from "@chakra-ui/react";
import { BiRun } from "react-icons/bi";
import { BsSquareHalf } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { BiReset } from "react-icons/bi";

import Chart from "react-apexcharts";

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

  const list = date in dates ? dates[date] : [];

  console.log({ list: list.map(({ deliveredAt }) => new Date(deliveredAt)) });

  return (
    <ParcelPopupProvider>
      <Flex
        direction="column"
        maxWidth="800px"
        minW="calc(100% - 1px)"
        p="8px 8px"
        gap="4px"
        alignItems="flex-end"
      >
        {/* <Box bg="var(--secondary-color-light)">
          <Chart
            options={{
              xaxis: {
                type: "datetime",
              },
              // dataLabels: {
              //   style: {
              //     colors: ["#F44336", "#E91E63", "#9C27B0"],
              //   },
              // },
              // fill: {
              //   colors: ["#F44336", "#E91E63", "#9C27B0"],
              // },
              markers: {
                colors: ["#F44336", "#E91E63", "#9C27B0"],
              },
              // grid: {
              //   row: {
              //     colors: ["#F44336", "#E91E63", "#9C27B0"],
              //   },
              //   column: {
              //     colors: ["#F44336", "#E91E63", "#9C27B0"],
              //   },
              // },
              // theme: {
              //   monochrome: {
              //     enabled: true,
              //     color: "#255aee",
              //     shadeTo: "light",
              //     shadeIntensity: 0.65,
              //   },
              // },
            }}
            series={[
              {
                name: "series-1",
                data: list.map(({ deliveredAt, parcels }) => ({
                  x: new Date(deliveredAt),
                  y: parcels.length,
                })),
              },
            ]}
            type="area"
          />
        </Box> */}

        <Select
          onChange={(e) => setDate(e.target.value)}
          color="blackAlpha.900"
          fontWeight="900"
          border="none"
          h="40px"
          w="140px"
          borderRadius="16px"
          background="whiteAlpha.800"
          boxShadow="0 1px 2px gray, inset 0 -1px 2px gray"
          outline="1px solid rgba(100,100,100,0.4)"
          fontWeight="900"
        >
          {Object.keys(dates).length > 0 &&
            Object.keys(dates).map((e) => (
              <option style={{ color: "white", background: "black" }} key={e}>
                {e}
              </option>
            ))}
        </Select>
        <Suspense fallback={<>Loading...</>}>
          <DeliveryList list={list} />
        </Suspense>

        <ParcelPopup />
      </Flex>
    </ParcelPopupProvider>
  );
}
