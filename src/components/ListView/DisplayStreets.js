import { useMemo } from "react";
import { cancelBubbleUp } from "../../utils";
import "./DisplayStreets.css";
import "./Search.css";

import plusIcon from "../../assets/img/plus.png";
import { imgs, nonColor, streetsStyle } from "./utils.js";

import { useStreetContext } from "../../utils/providers";
import { Link } from "react-router-dom";

export default function DisplayStreets() {
  const { suburbs } = useStreetContext();

  if (suburbs.length === 0) return <FirstParcel />;

  return (
    <div className="suburbs">
      {suburbs.map((suburb) => (
        <Suburb key={suburb} suburb={suburb} />
      ))}
    </div>
  );
}

const Suburb = ({ suburb }) => {
  const { display, remove, toggle, show, showSuburb, averagePerHour } =
    useStreetContext();

  const v = useMemo(
    () => ({
      suburb: suburb.toUpperCase(),
      setShow: () => showSuburb(suburb),
    }),
    [suburb, showSuburb]
  );

  const length = display[suburb].length;

  console.log(averagePerHour);

  return (
    <div className="suburb" onClick={v.setShow}>
      <div className="suburb-header">
        <span>{v.suburb}</span>
        <div>
          <span>
            {suburb === "Delivered"
              ? Math.round(10 * averagePerHour) / 10 + "/hr"
              : length}
          </span>
          <img alt="" src="./img/down.png" />
        </div>
      </div>
      <div className="streets" style={streetsStyle(show[suburb])}>
        {display[suburb].map((street, i) => (
          <Street
            key={`${street.id}st`}
            street={street}
            i={length - i}
            remove={cancelBubbleUp(remove(street.id))}
            toggle={cancelBubbleUp(toggle(street.id))}
          />
        ))}
      </div>
    </div>
  );
};

export const Street = ({ street, remove, toggle, toDisplay = false, i }) => {
  const { delivered, distance, parcels, address, number } = street;

  // display values for the parcels
  const v = {
    parcels: delivered ? (
      <div className="p-delivered">{parcels.length}</div>
    ) : parcels?.length > 0 ? (
      parcels.map((p, i) => <Parcel key={`p-${i}`} {...{ ...p }} />)
    ) : (
      "-"
    ),
    name: address.name
      ? `${number} ${address.name && address.name.toUpperCase()} ${
          address.type && address.type.toUpperCase()
        }`
      : "N/A",
    distance: delivered
      ? "-"
      : isNaN(distance)
      ? "?m"
      : Math.round(distance * 1000) + "m",
    complete: delivered ? (
      <span className="delivered">{i}</span>
    ) : (
      <img src="/img/accept.png" alt="" />
    ),
  };

  return (
    <div className="street">
      <div className="parcels">{v.parcels}</div>
      <div className="street-details">
        <span className="name">{v.name}</span>
        <div className="extra-details">
          <span className="distance">{v.distance}</span>
          <span className="address-notes">{street.notes}</span>
        </div>
      </div>
      {delivered || toDisplay ? (
        <button className="delete" onClick={remove}>
          <img src="/img/remove.png" alt="" />
        </button>
      ) : (
        <div></div>
      )}
      <button
        className="deliver"
        onClick={toggle}
        style={delivered ? { background: "green" } : {}}
      >
        {v.complete}
      </button>
    </div>
  );
};

const Parcel = ({ color, type, size }) => {
  const backgroundColor = {
    background: nonColor[color] ? nonColor[color] : color,
  };
  const v = {
    size: size?.toUpperCase(),
    src: imgs[type?.toLowerCase()] ? imgs[type?.toLowerCase()] : imgs.OTHER,
    color: color?.toUpperCase(),
    typeColor: {
      backgroundColor: type?.toUpperCase() === "BAG" ? "#a4a400" : "#ec7272a6",
    },
  };
  return (
    <div className="parcel">
      <div className="p-color" style={backgroundColor}></div>
      <div className="p-col">
        <div className="p-row">
          <div className="p-size">{v.size}</div>

          <div className="p-type">
            <img src={v.src} alt="" />
          </div>
        </div>
        <span className="p-label">{v.color}</span>
      </div>
    </div>
  );
};

const FirstParcel = () => (
  <div className="start-page">
    <h2>Add the first parcel.</h2>
    <div className="search">
      <button
        className="new"
        style={{ height: 50, width: 50, transform: "scale(1.5)" }}
      >
        <Link to="/new/0">
          <img src={plusIcon} alt="" />
        </Link>
      </button>
    </div>
  </div>
);
