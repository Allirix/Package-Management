import { nonColor, colors, TYPE_IMAGES as imgs } from "../NewParcel/constants";
import { cancelBubbleUp } from "../../utils";

export { nonColor, colors, imgs, cancelBubbleUp };

export const toTime = (time) => {
  if (time == null) return null;
  return new Date(time)
    .toLocaleString()
    .split(",")[1]
    .split(":")
    .slice(0, 2)
    .join(":");
};
export const getParcelShape = (shape) =>
  shape?.toUpperCase() === "BOX"
    ? "polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%);"
    : "polygon(50% 50%, 75% 0, 100% 50%, 100% 100%, 0 100%, 0 50%, 25% 0)";

// Link to google maps.
export const getGoogleMapsDirURL =
  ({ number, name, type, suburb }) =>
  ({ lat, lng }) =>
    `https://www.google.com/maps/dir/${lat},${lng}/${number}+${name}+${type},+${suburb}+QLD`;
