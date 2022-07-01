import bag from "../../assets/img/bag.png";
import box from "../../assets/img/box.png";
import OTHER from "../../assets/img/delete.png";

export const imgs = { bag, box, OTHER };
export const nonColor = {
  KMART: "linear-gradient(90deg, rgba(255,0,0,1) 50%, rgba(55,66,253,1) 50%)",
  TARGET:
    "radial-gradient(circle, rgba(255,255,255,1) 15%, rgba(255,0,0,1) 15%, rgba(255,0,0,1) 33%, rgba(245,245,255,1) 33%, rgba(255,255,255,1) 65%, rgba(255,0,0,1) 66%, rgba(255,0,0,1) 85%, rgba(255,255,255,1) 85%)",
  MYER: "linear-gradient(0deg, rgba(0,0,0,1) 33%, rgba(255,255,255,1) 33%, rgba(255,255,255,1) 66%, rgba(0,0,0,1) 66%)",
  OTHER:
    "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
  TP: "#9A7B4F",
};

export const streetsStyle = (toShow) =>
  toShow
    ? {
        height: "fit-content",
        opacity: 1,
        transition: "all 0.2s, height 0.2s ease-out, opacity 0.2s ease-out",
        transform: "scaleY(1)",
      }
    : {
        height: "0px",
        opacity: 0,
        transition: "all 0.2s, height 0.2s ease-out, opacity 0.1s ease-out",
        transform: "scaleY(0)",
      };
