import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  RiRoadMapLine,
  RiRoadMapFill,
  RiFolderHistoryFill,
  RiFolderHistoryLine,
  RiCollageFill,
  RiCollageLine,
  RiMapPinRangeFill,
  RiMapPinRangeLine,
  RiBus2Fill,
  RiBus2Line,
  RiBarChartBoxFill,
  RiBarChartBoxLine,
} from "react-icons/ri";

import { GoLocation, GoGear } from "react-icons/go";

export const pages = {
  deliveries: {
    Icon: RiBus2Line,
    Selected: RiBus2Fill,
    type: "main",
  },
  history: {
    Icon: RiBarChartBoxLine,
    Selected: RiBarChartBoxFill,
    type: "main",
  },
  streets: {
    Icon: RiCollageLine,
    Selected: RiCollageFill,
    type: "main",
  },
  map: {
    Icon: RiMapPinRangeLine,
    Selected: RiMapPinRangeFill,
    type: "main",
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
