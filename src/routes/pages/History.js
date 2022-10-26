import { Flex, Button, Select, Box, Text, useConst } from "@chakra-ui/react";
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

/*
total pickups each week
total parcels each week
total locations each week

best street

best location





*/

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

  const statistics = useConst(() => transformRecharted(sorted), []);

  console.log(
    statistics,
    statistics.totals.getAveragePerDay(),
    statistics.totals.getAveragePerHour()
  );

  // data = Object.keys(data)
  //   .sort((a, b) => Number(a) - Number(b))
  //   .map((e) => ({
  //     primary: new Date(Number(e)).toLocaleTimeString(),
  //     secondary: data[e],
  //   }));

  return (
    // <ParcelPopupProvider>
    <Flex
      direction="column"
      maxWidth="800px"
      p="8px 0"
      gap="4px"
      alignItems="center"
      w="100vw"
    >
      <Flex
        width="calc(100% - 16px)"
        h="calc(100%)"
        bg="white"
        borderRadius="16px"
        maxHeight="300px"
        minHeight="300px"
        p="32px 32px 16px 32px"
        flexDirection="column"
        // boxShadow="0 2px 2px gray"
      >
        <Flex
          fontSize="44px"
          fontWeight="500"
          alignItems="center"
          // textShadow="0 0 1px black"
        >
          {Math.round(100 * statistics.average) / 100}

          <Text opacity="0.5" fontSize="20px">
            /hr
          </Text>
        </Flex>

        <RechartLine {...{ ...statistics }} />
      </Flex>

      {/* <Header delivered={list} /> */}

      {/* <Flex w="100%" justifyContent="flex-end">
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
      </Flex> */}
      <Flex p="8px" w="100%">
        <DeliveryList list={sorted} />
      </Flex>

      {/* <ParcelPopup /> */}

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
    // </ParcelPopupProvider>
  );
}

function transformRecharted(rawData) {
  let sum = 0,
    count = 0;
  const arr = new Array(12).fill({}).reduce((acc, e, i) => {
    acc[i + 7] = { name: i + 7 };
    return acc;
  }, {});
  let dateTimeCount = {};

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
      dateTimeCount[e] = (dateTimeCount[e] || 0) + 1;
    });

  let keys = new Set();

  dateTimeCount = Object.keys(dateTimeCount).map((e) => {
    const [date, time] = e.split(",");

    keys.add(date);

    const timeKey = Number(time);
    arr[timeKey] = { ...arr[timeKey], [date]: dateTimeCount[e] };
    return e;
  });

  //

  // convert [datetime,] => [{name: hour, date: count}]

  const keysArr = [...Array.from(keys), "average"];

  const data = Object.keys(arr)
    .map((e) => {
      const sum = Object.keys(arr[e])
        .filter((e) => e !== "name")
        .reduce((acc, ee) => acc + arr[e][ee], 0);

      const length = Object.keys(arr[e]).length - 1;

      return { name: e, ...arr[e], average: !length ? 0 : sum / length };
    })
    .sort((a, b) => a.name - b.name);

  return {
    data,
    keys: keysArr,
    average: data.reduce((sum, e) => sum + e.average, 0) / 12,
    averageArr: data.map((e) => e.average),
    min: Math.min(...data.map((e) => e.average)),
    max: Math.max(...data.map((e) => e.average)),
    totals: data.reduce(
      (totals, time) => {
        data.map((datum) => {
          Object.keys(time)
            .filter((e) => !(e === "average" || e === "name"))
            .forEach((e) => {
              if (!(e in datum)) return;
              totals.n = totals.n + 1;
              totals.sum = totals.sum + datum[e];
            });
        });

        return totals;
      },
      {
        sum: 0,
        n: 0,
        days: keysArr.length - 1,
        getAveragePerDay() {
          return this.sum / this.days;
        },
        getAveragePerHour() {
          return this.sum / this.n;
        },
      }
    ),
  };
}
