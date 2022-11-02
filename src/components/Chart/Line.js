import testData from "./test.json";
import React from "react";
import { AxisOptions, Chart } from "react-charts";
import { Flex } from "@chakra-ui/react";
import ResizableBox from "./ResizableBox";

const dataDefault = testData
  .map((e) => ({
    ...e,
    data: e.data.map((ee) => ({ ...ee, primary: ee.primary.split("T")[0] })),
  }))
  .sort((a, b) => Math.random() - 0.5);

export default function Line({ data = dataDefault }) {
  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
        elementType: "line",
        primaryAxisType: "time",
        show: false,
      },
    ],
    []
  );

  return (
    // <ResizableBox
    //   flexDirection="column"
    //   padding="12px"
    //   border="2px solid black"
    //   height="400"
    //   w="calc(100vw - 8px)"
    // >
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
    // </ResizableBox>
  );
}
