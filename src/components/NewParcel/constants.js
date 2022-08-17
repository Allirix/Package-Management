import {
  BsFillBagFill,
  BsBox,
  BsQuestion,
  BsFillSquareFill,
} from "react-icons/bs";

export const TYPE_IMAGES = {
  BAG: BsFillBagFill,
  BOX: BsFillSquareFill,
  OTHER: BsQuestion,
};

export const colors = [
  "green",
  "blue",
  "pink",
  "red",
  "white",
  "KMART",
  "TARGET",
  "MYER",
  "black",
  "brown",
  "OTHER",
  "TP",
  "yellow",
].map((e) => e.toUpperCase());

export const nonColor = {
  KMART: "-webkit-linear-gradient(90deg, #FF3B3B 50%, rgba(55,66,253,1) 50%)",
  TARGET:
    "radial-gradient(circle, rgba(255,255,255,1) 15%, rgba(255,0,0,1) 15%, rgba(255,0,0,1) 33%, rgba(245,245,255,1) 33%, rgba(255,255,255,1) 65%, rgba(255,0,0,1) 66%, rgba(255,0,0,1) 85%, rgba(255,255,255,1) 85%)",
  MYER: "linear-gradient(0deg, rgba(0,0,0,1) 33%, rgba(255,255,255,1) 33%, rgba(255,255,255,1) 66%, rgba(0,0,0,1) 66%)",
  OTHER:
    "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
  L: "rgb(100,100,100)",
  M: "rgb(140,140,140)",
  S: "rgb(180,180,180)",
  BAG: "rgb(240,240,240)",
  BOX: "rgb(148, 84, 27)",
  MITCHELTON: "red",
  KEPERRA: "magenta",
  GAYTHORNE: "green",
  "UPPER KEDRON": "blue",
  BROWN: "rgb(148, 84, 27)",
  TP: "radial-gradient(circle, rgba(154,123,79,1) 19%, rgba(227,193,145,1) 100%)",
  RED: "#FF3B3B",
  BLUE: "#1D45CC",
  GREEN: "#24BD24",
  YELLOW: "#e6ba00",
};

export const options = [7, 8, 9, 4, 5, 6, 1, 2, 3, "Reset", 0, "Next"];

export const popular = [
  { color: "TARGET", type: "BOX", size: "S" },
  { color: "TARGET", type: "BOX", size: "M" },
  { color: "TARGET", type: "BOX", size: "L" },
  { color: "MYER", type: "BAG", size: "S" },
  { color: "MYER", type: "BAG", size: "M" },
  { color: "MYER", type: "BAG", size: "L" },
  { color: "WHITE", type: "BAG", size: "S" },
  { color: "WHITE", type: "BAG", size: "M" },
  { color: "WHITE", type: "BAG", size: "L" },
  { color: "TP", type: "BOX", size: "S" },
  { color: "TP", type: "BOX", size: "M" },
  { color: "TP", type: "BOX", size: "L" },
  { color: "BROWN", type: "BOX", size: "S" },
  { color: "BROWN", type: "BOX", size: "M" },
  { color: "BROWN", type: "BOX", size: "L" },
];

export const TYPE = { BOX: "rgba(100,50,0,0.5)", BAG: "rgba(255,255,255,0.5)" };
