import { RiTruckFill, RiTruckLine } from "react-icons/ri";
import { BsMap, BsMapFill } from "react-icons/bs";

import { GoLocation, GoGear } from "react-icons/go";

export const pages = {
  deliveries: {
    Icon: RiTruckLine,
    Selected: RiTruckFill,
    type: "main",
  },

  map: {
    Icon: BsMap,
    Selected: BsMapFill,
    type: "main",
  },
  streets: {
    Icon: GoLocation,
    type: "menu",
  },
  settings: {
    Icon: GoGear,
    type: "menu",
  },
};

const toPageArray = (type) =>
  Object.keys(pages)
    .map((e) => ({ ...pages[e], path: e }))
    .filter((e) => e.type === type);

export const main = toPageArray("main");
export const menu = toPageArray("menu");
