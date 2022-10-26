import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

const exampleData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function RechartLine({ data = exampleData, keys = ["pv"] }) {
  //   const average = data.map((e) => {
  //     const keys = Object.keys(e).filter((e) => e !== "name");

  //     const average = keys.reduce((acc, ee) => acc + e[ee], 0);
  //     console.log(keys, average);
  //     return { name: e.name, av: average };
  //   });

  //   console.log(`rgb(${randBit()}, ${randBit()}), ${randBit()})`);

  const Lines = keys.map((e, i) => {
    const k = Object.keys(e).filter((e) => e !== "name");
    const average = k.reduce((acc, ee) => acc + e[ee], 0);

    return (
      <Line
        type="natural"
        dataKey={e}
        stroke={`rgb(${randBit()}, ${randBit()}, ${randBit()})`}
        strokeWidth="3"
        dot={false}
        key={i}
        connectNulls
      />
    );
  });

  console.log(Lines);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 0,
        }}
      >
        {/* <CartesianGrid strokeDasharray="10 10" stroke="rgb(250,250,250)" /> */}
        <XAxis
          dataKey="name"
          minTickGap="1"
          tickMargin="10"
          fontSize="12"
          fontWeight="300"
          opacity="0.5"
        />
        {/* <YAxis yAxisId="left" /> */}
        <Tooltip
          contentStyle={{
            background: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "900",
          }}
        />
        {/* <Legend /> */}
        {Lines}
        <Line
          type="natural"
          dataKey={"average"}
          stroke={`rgb(${randBit()}, ${randBit()}, ${randBit()})`}
          strokeWidth="3"
          dot={false}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const randBit = () => Math.round(Math.random() * 255);
