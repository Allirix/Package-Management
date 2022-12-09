import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Text,
  useConst,
} from "@chakra-ui/react";
import { useState } from "react";
import RechartLine from "../../components/Chart/RechartLine";
import { useSortedDelivery } from "../../utils/providers";
import { BsDot } from "react-icons/bs";
import { GiCardPickup } from "react-icons/gi";
import { IoMdPin } from "react-icons/io";
import { FiPackage } from "react-icons/fi";
import DeliveryList from "../../components/Deliveries/DeliveryList";
import "../../utils/date-time-helpers";
import { Select } from "chakra-react-select";
import {
  convertDateArrayToOnlyFirstDays,
  getPrevious7Days,
  getTimePassedSinceNow,
  sortSundayFirst,
  getSelectedDates,
  doDatesMatch,
  parseDate,
  dateRangeLabel,
} from "../../utils/date-time-helpers";
import { add, parse } from "date-fns";
import { useRef } from "react";
import { useMemo } from "react";

import FirstDelivery from "../../components/FirstDelivery";

const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map(
  (e) => e.toUpperCase()
);

export default function Home() {
  const { sorted, delivered, undelivered } = useSortedDelivery();

  const dates = {
    ...sorted.reduce((acc, location) => {
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
    }, {}),
    [new Date().toLocaleDateString("en-GB")]: delivered,
  };

  const dateOptions = convertDateArrayToOnlyFirstDays(
    sorted
      .flatMap(
        (delivery) =>
          "parcelsArchive" in delivery && Object.keys(delivery.parcelsArchive)
      )
      .filter((e) => e)
      .map((e) => new Date(Number(e)))
  )
    .map((e) => ({
      value: e,
      label: dateRangeLabel(e),
    }))
    .sort((a, b) => b.value - a.value);

  const count = getParcelsForGivenDate(sorted);

  // Selected Weeks
  const [selectedWeeks, setSelectedWeeks] = useState(
    dateOptions.length > 0 ? [dateOptions[0]] : [{ label: "No Data" }]
  );

  // Selected Days
  const [selectedDays, setSelectedDays] = useState([new Date().getDay()]);

  const weekValues = getWeeklyCount(selectedWeeks, count);

  const statistics = useMemo(
    () =>
      transformRecharted(
        sorted,
        weekValues
          .map((e) => e.dates)
          .filter((e, i) => selectedDays.includes(i))
          .flatMap((e) => e)
          .map((e) => parseDate(e))
      ),
    [weekValues, sorted]
  );

  if (sorted.length < 1) return <FirstDelivery />;

  const list = weekValues
    .map((e) => e.dates)
    .filter((e, i) => selectedDays.includes(i))
    .flatMap((e) => e)
    .flatMap((e) => {
      return dates[e];
    })
    .filter((e) => e)
    .sort((a, b) => b.deliveredAt - a.deliveredAt);

  // console.log(statistics.totals.getAveragePerDay());

  return (
    <Flex
      flexDirection="column"
      gap="8px"
      w="100%"
      p="8px 8px"
      pb="700px"
      fontFamily="Montserrat"
    >
      <SelectWeeks
        options={dateOptions}
        value={selectedWeeks}
        setValue={setSelectedWeeks}
      />
      <DaysOfWeek
        weeks={selectedWeeks}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        weekValues={weekValues}
      />
      {!isNaN(statistics.totals.getAveragePerDay()) && (
        <Container
          bg="white"
          h="300px"
          pb="80px"
          fontFamily="Montserrat"
          fontWeight="900"
        >
          <Flex
            fontSize="44px"
            fontWeight="500"
            p="16px 16px 0 16px"
            w="100%"
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              {Math.round(100 * statistics.totals.getAveragePerHour()) / 100}

              <Text opacity="0.5" fontSize="20px">
                /hr
              </Text>
            </Flex>

            <Flex alignItems="center" fontSize="20px">
              {Math.round(100 * statistics.totals.getAveragePerDay()) / 100}

              <Text opacity="0.5" fontSize="12px">
                /day
              </Text>
            </Flex>
          </Flex>

          <RechartLine {...{ ...statistics }} />
        </Container>
      )}
      <Flex flexDirection="column">
        <Flex flexDirection="column" w="100%" maxW="100vw">
          {list.length > 0 && <DeliveryList list={list} />}
        </Flex>
      </Flex>
    </Flex>
  );

  function DaysOfWeek(props) {
    const { selectedDays, setSelectedDays, weekValues } = props;
    const today = useConst(() => daysOfWeek[new Date().getDay()]);

    const total = selectedDays?.reduce(
      (sum, dayIndex) => sum + weekValues[dayIndex]?.parcels,
      0
    );

    const totalPickups = selectedDays.reduce(
      (sum, dayIndex) => sum + weekValues[dayIndex]?.pickups,
      0
    );

    return (
      <Container bg="white">
        <FormControl p={4}>
          <Flex
            alignItems="center"
            w="100%"
            justifyContent="space-between"
            pb="0.75rem"
            fontWeight="600"
          >
            {/* <Flex>Select Days</Flex> */}
            <Flex fontWeight="100" alignItems="center" justifyContent="center">
              <FiPackage size="15px" color="gray" />
              {totalPickups}/{total - totalPickups}
            </Flex>
          </Flex>
          <Flex wrap="wrap" gap="8px">
            {daysOfWeek.map((dayName, dayIndex) => {
              return (
                <DayButton
                  key={dayIndex}
                  {...{
                    parcels: weekValues[dayIndex]?.parcels,
                    deliveries: weekValues[dayIndex]?.deliveries,
                    pickups: weekValues[dayIndex]?.pickups,
                    day: dayName,
                    isSelected: selectedDays.includes(dayIndex),
                    isToday: dayName === today,
                    onClick: () =>
                      selectedDays.includes(dayIndex)
                        ? setSelectedDays((s) => [
                            ...s.filter((e) => e !== dayIndex),
                          ])
                        : setSelectedDays((s) => [
                            ...s.filter((e) => e !== dayIndex),
                            dayIndex,
                          ]),
                  }}
                />
              );
            })}
          </Flex>
        </FormControl>
      </Container>
    );
  }
}

function DayButton({
  day,
  isSelected,
  isToday,
  onClick,
  parcels = 0,
  deliveries = 0,
  pickups = 0,
}) {
  const bg = isSelected ? "rgb(237,242,247)" : "black";
  const fg = isSelected ? "green.900" : "rgb(237,242,247)";

  return (
    <Flex
      background="white"
      h="70px"
      w="70px"
      fontSize="14px"
      fontWeight="400"
      onClick={onClick}
      m="0"
    >
      <Flex
        flexDirection="column"
        w="100%"
        outline={
          isSelected ? "1px solid rgb(34,84,61)" : "1px solid rgb(237,242,247)"
        }
      >
        <Flex
          w="100%"
          bg={fg}
          color={bg}
          justifyContent="center"
          alignItems="center"
          fontWeight="500"
          opacity="0.9"
          fontSize="10px"
        >
          {isToday && <BsDot color="red" />}
          {day}
        </Flex>
        <Flex
          h="100%"
          w="100%"
          alignItems="center"
          justifyContent="center"
          gap="4px"
          flexDirection="column"
          p="4px"
        >
          <Flex
            alignItems="center"
            fontSize="14px"
            fontWeight="700"
            justifyContent="center"
            color="blackAlpha.800"
          >
            <IoMdPin />

            {deliveries}
          </Flex>
          <Flex
            fontSize="12px"
            justifyContent="center"
            w="100%"
            alignItems="center"
            fontWeight="100"
          >
            <FiPackage color="gray" />
            {pickups}/{parcels - pickups}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

function SelectWeeks(props) {
  // console.log(
  //   props.value.map((e) => e.label),
  //   props.options
  //     .map((e) => e.label)
  //     .filter((e) => !props.value.map((e) => e.label).includes(e)),
  //   props.options.filter(
  //     (e) => !props.value.map((e) => e.label).includes(e.label)
  //   )
  // );

  return (
    <Container bg="white">
      <FormControl p={4}>
        {/* <FormLabel>Select Weeks</FormLabel> */}
        <Select
          isMulti
          autoFocus
          isSearchable={false}
          menuShouldScrollIntoView
          name="colors"
          options={props.options}
          placeholder="Select some dates..."
          closeMenuOnSelect={true}
          value={props.value}
          onChange={(e) => props.setValue(uniq(e))}
          // {...{ ...props }}
        />
      </FormControl>
    </Container>
  );
}

function transformRecharted(rawData, dates) {
  let sum = 0,
    count = 0;
  const arr = {};
  new Array(24).fill(0).forEach((e, i) => {
    arr[i] = { name: i };
  });
  let dateTimeCount = {};

  rawData
    .map((e) => e.parcelsArchive)
    .filter((e) => e)
    .flatMap((e) => Object.keys(e))
    .map((e) => Number(e))
    .filter((e) => doDatesMatch(new Date(e), dates))
    .sort()
    .map((e) => {
      // console.log(new Date(e), new Date(e).getHours());
      return new Date(e).toLocaleString("en-GB");
    })
    .map((e) => {
      return e.split(", ");
    })
    .map((e) => [e[0], e[1].split(":")[0]])
    .forEach((e) => {
      dateTimeCount[e] = (dateTimeCount[e] || 0) + 1;
    });

  let keys = new Set();

  dateTimeCount = Object.keys(dateTimeCount).map((e) => {
    const [date, time] = e.split(",");

    keys.add(date);

    const timeKey = Number(time);

    arr[timeKey] = {
      ...arr[timeKey],
      [date]: dateTimeCount[e],
      name: Number(timeKey),
    };
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

      const length = Object.keys(arr[e]).filter((e) => e !== "name").length;

      return {
        name: Number(e),
        ...arr[e],
        average: !length ? null : sum / length,
      };
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
        Object.keys(time)
          .filter((e) => !(e === "average" || e === "name"))
          .forEach((e) => {
            if (!(e in time)) return;
            totals.hours = totals.hours + 1;
            totals.sum = totals.sum + time[e];
          });

        return totals;
      },
      {
        sum: 0,
        hours: 0,
        days: keysArr.length - 1,
        getAveragePerDay() {
          return this.sum / this.days;
        },
        getAveragePerHour() {
          return this.sum / this.hours;
        },
      }
    ),
  };
}

function getParcelsForGivenDate(sorted, countParcels = false) {
  return sorted
    .filter((e) => e.parcelsArchive)
    .flatMap((e) => {
      const parcelList = e.parcelsArchive;
      const dates = Object.keys(parcelList);
      return dates.map((date) => ({
        parcels: parcelList[date].reduce((acc, e) => acc + Number(e.count), 0),
        pickups: parcelList[date].reduce(
          (acc, e) => acc + (e.type === "PICKUP" ? Number(e.count) : 0),
          0
        ),
        date: new Date(Number(date)).toLocaleDateString("en-GB"),
      }));
    })
    .reduce((dateObj, { date, parcels, pickups }) => {
      dateObj[date] = {
        deliveries: (dateObj[date]?.deliveries || 0) + 1,
        parcels: (dateObj[date]?.parcels || 0) + parcels,
        pickups: (dateObj[date]?.pickups || 0) + pickups,
      };

      return dateObj;
    }, {});
}

function uniq(arr, key = "label", seen = {}) {
  if (!key)
    return arr.filter((item) =>
      seen.hasOwnProperty(item) ? false : (seen[item] = true)
    );
  return arr.filter((item) =>
    seen.hasOwnProperty(item[key]) ? false : (seen[item[key]] = true)
  );
}

function getWeeklyCount(weeks, count) {
  return uniq(weeks)
    .map((date) => {
      if (!("value" in date)) return null;
      const datekey = date.value.toLocaleDateString("en-GB");
      return {
        date: datekey,
        parcels: count[datekey]?.parcels || 0,
        deliveries: count[datekey]?.deliveries || 0,
        day: date.value.getDay(),
        dateObj: date.value,
        pickups: count[datekey]?.pickups || 0,
      };
    })
    .reduce((acc, baseDate) => {
      if (baseDate === null) return [];

      const week = getPrevious7Days(baseDate.dateObj);
      week.forEach((e) => {
        const dateKey = e.toLocaleDateString("en-GB");
        const obj = acc[e.getDay()];
        acc[e.getDay()] = {
          ...obj,
          parcels: obj.parcels + (count[dateKey]?.parcels || 0),
          deliveries: obj.deliveries + (count[dateKey]?.deliveries || 0),
          pickups: obj.pickups + (count[dateKey]?.pickups || 0),
          dates: [...obj.dates, dateKey],
        };
      });

      return acc;
    }, new Array(7).fill({ parcels: 0, deliveries: 0, pickups: 0, dates: [] }));
}
