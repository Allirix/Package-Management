import React from "react";
import { Chart } from "react-google-charts";

import { Flex } from "@chakra-ui/react";
import { useDeliveryDb } from "../src/utils/providers";
import { countHours } from "../src/utils/hooks/utils";

export const options = {
  backgroundColor: "transparent",
  chart: {},
  legend: { position: "bottom" },
  hAxis: { minValue: 0 },
  vAxis: { minValue: 0 },
  lineWidth: 6,
  colors: ["#031e36", "#387a50", "#d9263e"],
  curveType: "function",
  width: "400px",
  height: "200px",
};

export default () => {
  const { display } = useDeliveryDb();

  const data = [["Hour", "now"]].concat(
    toArray(countHours(display?.Delivered))
  );
  if (!(data.length > 1)) return null;

  return (
    <Flex
      direction={"column"}
      bg="rgba(255,255,255,0.9)"
      m={"0 auto"}
      borderRadius={"1rem"}
    >
      <Flex m="-1rem -1.5rem">
        <Chart
          id="chart"
          containerId="chart"
          chartType="LineChart"
          data={data}
          options={options}
        />
      </Flex>
    </Flex>
  );
};

const toArray = (del) => {
  return del && Object.keys(del).map((e) => [e, del[e]]);
};
