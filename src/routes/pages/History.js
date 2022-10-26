import { Flex, Button, Select, Box, Text } from "@chakra-ui/react";
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

import DeliveryList from "../../components/Deliveries/DeliveryList";
import { Header } from "./Deliveries";
import ResizableBox from "../../components/Chart/ResizableBox";
import Line from "../../components/Chart/Line";
import RechartLine from "../../components/Chart/RechartLine";

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

  const { average, locations, parcels, pickups, averageParcels } = useStatCard({
    delivered: [],
    undelivered: list,
  });

  // to time "Date, Time"

  // add time strings to date key

  // round time strings to nearest hour and group

  let data = sorted
    .sort((a, b) => Number(b.deliveredAt) - Number(a.deliveredAt))
    .map(({ deliveredAt }) => new Date(deliveredAt).toLocaleString())
    .filter((e) => e !== "Invalid Date") //undelivered
    .reduce((acc, e) => {
      const [date, time] = e.split(", ");
      const timeKey = `${time.split(":")[0]}`;

      if (date in acc && timeKey in acc[date]) acc[date][timeKey]++;
      else acc[date] = { ...acc[date], [timeKey]: 1 };

      return acc;
    }, {});

  data = Object.keys(data).map((e) => {
    return {
      label: e,
      data: Object.keys(data[e]).map((t) => {
        return { primary: Number(t), secondary: data[e][t] };
      }),
    };
  });

  // data = Object.keys(data)
  //   .sort((a, b) => Number(a) - Number(b))
  //   .map((e) => ({
  //     primary: new Date(Number(e)).toLocaleTimeString(),
  //     secondary: data[e],
  //   }));

  return (
    <ParcelPopupProvider>
      <Flex
        direction="column"
        maxWidth="800px"
        p="8px 8px"
        gap="4px"
        alignItems="center"
        w="100vw"
      >
        <Header delivered={list} />

        <Flex
          width="calc(100% - 16px)"
          h="calc(100%)"
          bg="white"
          borderRadius="16px"
          minHeight="300px"
          p="32px 32px 16px 32px"
          flexDirection="column"
          // boxShadow="0 2px 2px gray"
        >
          {/* <Text
            textTransform="uppercase"
            fontWeight="900"
            // opacity="0.7"
            color="green.800"
            fontFamily="'Montserrat' !important"
            w="100%"
            fontSize="10px"
          >
            All Deliveries
          </Text> */}
          {/* <Line data={data} /> */}
          {/* <Line /> */}
          <RechartLine {...{ ...transformRecharted(sorted) }} />
        </Flex>

        <Flex w="100%" justifyContent="flex-end">
          <Select
            onChange={(e) => setDate(e.target.value)}
            color="blackAlpha.900"
            fontWeight="900"
            border="none"
            h="40px"
            w="140px"
            borderRadius="16px"
            background="whiteAlpha.800"
            fontWeight="900"
          >
            {Object.keys(dates).length > 0 &&
              Object.keys(dates).map((e) => (
                <option style={{ color: "white", background: "black" }} key={e}>
                  {e}
                </option>
              ))}
          </Select>
        </Flex>

        <DeliveryList list={list} />

        <ParcelPopup />

        {/* <Box bg="var(--secondary-color-light)" w="100vw">
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
                data: list
                  .sort((a, b) => a.deliveredAt - b.deliveredAt)
                  .map(({ deliveredAt, parcels }) => ({
                    x: new Date(deliveredAt),
                    y: parcels.length,
                  })),
              },
            ]}
            type="area"
          />
        </Box> */}
      </Flex>
    </ParcelPopupProvider>
  );
}

function transformRecharted(rawData) {
  const arr = new Array(13).fill({}).reduce((acc, e, i) => {
    acc[i + 7] = { name: i + 7 };
    return acc;
  }, {});
  let count = {};

  rawData
    .map((e) => e.parcelsArchive)
    .filter((e) => e)
    .flatMap((e) => Object.keys(e))
    .map((e) => Number(e))
    .sort()
    .map((e) => new Date(e).toLocaleString())
    .map((e) => e.split(", "))
    .map((e) => [e[0], e[1].split(":")[0]])
    .forEach((e) => {
      count[e] = (count[e] || 0) + 1;
    });

  let keys = new Set();

  count = Object.keys(count).map((e) => {
    const [date, time] = e.split(",");

    keys.add(date);

    const timeKey = Number(time);
    arr[timeKey] = { ...arr[timeKey], [date]: count[e] };
    return e;
  });

  //

  // convert [datetime,] => [{name: hour, date: count}]

  const keysArr = [...Array.from(keys), "average"];

  return {
    data: Object.keys(arr)
      .map((e) => {
        const average =
          Object.keys(arr[e])
            .filter((e) => e !== "name")
            .reduce((acc, ee) => {
              console.log(ee, e, acc, arr[e][ee]);
              return acc + arr[e][ee];
            }, 0) / keysArr.length;

        console.log(Object.values(arr[e]), average);
        return { name: e, ...arr[e], average };
      })
      .sort((a, b) => a.name - b.name),
    keys: keysArr,
  };
}
