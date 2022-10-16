import {
  GoogleMap,
  Marker,
  Polygon,
  useLoadScript,
  // DirectionsService,
} from "@react-google-maps/api";

import map from "../../data/map.json";

import { Button, Flex, Spinner, Text, useConst } from "@chakra-ui/react";

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";

import Street from "../../components/Deliveries/Place";

import "../../components/Map/Map.css";

import { useEffect, useMemo, useState } from "react";
import {
  useDeliveryDb,
  useMyPosition,
  useSortedDelivery,
} from "../../utils/providers";
import FirstDelivery from "../../components/FirstDelivery";
import { Loading } from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { FaCross } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BiMinus, BiNavigation, BiPlus } from "react-icons/bi";

// const subs = ["Mitchelton", "Upper Kedron", "Keperra", "Gaythorne"];
const mapColors = ["red", "blue", "magenta", "green"]; // red, green, blue, yellow, cyan
const mapData = map.features.map((e) =>
  e.geometry.coordinates[0].map((c) => ({ lat: c[1], lng: c[0] }))
);

const options = (i) => ({
  fillColor: mapColors[i],
  fillOpacity: 0.05,
  strokeColor: "black",
  strokeOpacity: 0.5,
  strokeWeight: 1,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
});

const icons = {
  dot: "M 10 19 C 14.97 19 19 14.971 19 10 C 19 5.03 14.97 1 10 1 C 5.029 1 1 5.03 1 10 C 1 14.971 5.029 19 10 19 Z",
  G: "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m13.484 44.508h-4.017l-.609-3.622c-1.168 1.372-2.219 2.339-3.15 2.9c-1.601.979-3.569 1.47-5.905 1.47c-3.845 0-6.995-1.332-9.448-3.993c-2.56-2.676-3.839-6.335-3.839-10.978c0-4.695 1.292-8.459 3.878-11.292c2.585-2.833 6.004-4.249 10.256-4.249c3.688 0 6.65.935 8.888 2.805s3.521 4.203 3.849 6.998h-5.965c-.459-1.981-1.582-3.366-3.365-4.153c-.998-.434-2.107-.649-3.328-.649c-2.336 0-4.255.881-5.758 2.643c-1.502 1.762-2.254 4.41-2.254 7.946c0 3.563.814 6.085 2.441 7.565c1.627 1.479 3.478 2.22 5.551 2.22c2.035 0 3.701-.584 5-1.751c1.3-1.167 2.1-2.696 2.402-4.588h-6.713v-4.843h12.087v15.571z",
  U: "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m11.644 32.952c0 3.084-.479 5.486-1.434 7.205c-1.783 3.149-5.182 4.725-10.201 4.725c-5.018 0-8.424-1.575-10.219-4.725c-.957-1.719-1.434-4.121-1.434-7.205V17.118h6.16v17.82c0 1.993.236 3.448.707 4.366c.732 1.626 2.328 2.439 4.785 2.439c2.445 0 4.035-.813 4.768-2.439c.471-.918.705-2.373.705-4.366v-17.82h6.162v17.834z",
  K: "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m6.016 44.508l-8.939-12.666l-2.922 2.961v9.705h-5.963V17.492h5.963v11.955l11.211-11.955h7.836L33.293 29.426l12.518 17.082h-7.795",
  M: "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m14.035 44.508h-5.65V26.882c0-.564.008-1.355.02-2.372c.014-1.018.02-1.802.02-2.353l-5.498 24.351h-5.893l-5.459-24.351c0 .551.006 1.335.02 2.353c.014 1.017.02 1.808.02 2.372v19.626h-5.65V17.492h8.824l5.281 22.814l5.242-22.814h8.725v29.016z",
};

const currentPositionIcon = {
  path: icons.dot,
  fillColor: "#005BB2",
  fillOpacity: 0.9,
  scale: 0.6,
  strokeWeight: 2,
  strokeColor: "white",
  anchor: window.google?.maps && new window.google.maps.Point(15, 15),
};

const colors = {
  G: "green",
  U: "blue",
  K: "magenta",
  M: "red",
  PICKUP: "orange",
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapOptions = {
  maxZoom: 20,
  streetViewControl: false,
  mapTypeControl: false,
  mapTypeId: "roadmap",
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit.station.bus",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const fallbackPosition = { lat: 152.96693758699996, lng: -27.42390230222802 };

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
  });

  const [selected, setSelected] = useState([]);

  const location = useMyPosition();
  const centre = useConst(
    () =>
      !location.error
        ? { lat: location.lat, lng: location.lng }
        : fallbackPosition,
    []
  );
  const { isEmpty, undelivered } = useSortedDelivery();

  const [waypoints, setWaypoints] = useLocalStorage(
    "waypoints",
    generateWaypoints(undelivered)
  );

  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (waypoints.length <= 10) setWaypoints(generateWaypoints(undelivered));
  }, [undelivered]);

  // const distanceMatrix = useMemo(() => {
  //   return null;
  //   return (
  //     <DirectionsService
  //       options={{
  //         waypoints,
  //         origin: centre,
  //         destination: centre,
  //         optimizeWaypoints: true,
  //         travelMode: "DRIVING",
  //       }}
  //       callback={(response) => {
  //         console.log(response);
  //       }}
  //     />
  //   );
  // }, []);

  if (isEmpty) return <FirstDelivery />;

  if (!isLoaded) return <Loading />;
  if (loadError) return "error";

  return (
    <Flex flexDir="column" w="100%">
      <Flex p="4px" gap="4px" alignItems="center" h="48px">
        <Button
          onClick={() => setZoom((z) => Math.round(10 * (z - 0.1)) / 10)}
          p="0"
          variant="outline"
        >
          <BiMinus color="white" />
        </Button>
        <Flex flexDirection="column" w="100%">
          <Text fontSize="10px" color="white" fontWeight="900">
            Zoom
          </Text>
          <RangeSlider
            aria-label={["min", "max"]}
            defaultValue={[0, 30]}
            onChange={(val) => setZoom(12 + (8 * val[1]) / 100)}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="var(--ternary-color)" />
            </RangeSliderTrack>
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </Flex>

        <Text
          fontSize="10px"
          color="white"
          fontWeight="900"
          width="25px"
          textAlign="center"
        >
          {Math.round(zoom * 10) / 10}
        </Text>

        <Button
          variant="outline"
          onClick={() => setZoom((z) => Math.round(10 * (z + 0.1)) / 10)}
          p="0"
        >
          <BiPlus color="white" />
        </Button>
      </Flex>

      {selected.length > 0 && (
        <Route
          selected={selected}
          setSelected={setSelected}
          location={location}
        />
      )}

      <GoogleMap
        center={centre}
        zoom={zoom}
        style={containerStyle}
        id="map"
        options={MapOptions}
      >
        <Marker icon={currentPositionIcon} position={location} />
        <Markers setSelected={setSelected} selected={selected} />
        <Suburbs />
      </GoogleMap>
      <Overlay />

      {/* {distanceMatrix} */}
    </Flex>
  );
}

const Route = ({ selected = [], location, setSelected }) => {
  return (
    <Flex
      position="absolute"
      top="110px"
      left="2px"
      flexDirection="column"
      background="rgba(0,0,0,0.7)"
      zIndex="10000"
      p="4px"
      borderRadius="4px"
      gap="4px"
      alignItems="flex-end"
    >
      {selected.map((e, i) => (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          gap="4px"
          w="100%"
          key={e.id}
        >
          <Flex gap="4px">
            <Text
              fontWeight="900"
              color="var(--ternary-color)"
              fontSize="14px"
              lineHeight="16px"
            >
              {e.number}
            </Text>
            <Text color="white" fontSize="12px" opacity="0.7">
              {e.name}
            </Text>
          </Flex>

          <Button
            p="0"
            onClick={() =>
              setSelected((s) => s.filter(({ id }) => e.id !== id))
            }
            background="transparent"
            border="1px solid red"
          >
            <MdClose color="red" size="20px" />
          </Button>
        </Flex>
      ))}
      <Button
        background="transparent"
        onClick={() =>
          window.open(getGoogleDirectionsLink(location, selected), "_blank")
        }
        border="1px solid var(--ternary-color)"
        w="fit-content"
        h="50px"
        w="50px"
        p="0"
      >
        <BiNavigation color="var(--ternary-color)" size="25px" />
      </Button>
    </Flex>
  );
};

/*

https://www.google.com/maps/dir/-27.4974534,153.0503714/1+Andover+St,+Mitchelton+QLD+4053/12+Andover+Street,+Mitchelton+QLD

*/

function getGoogleDirectionsLink({ lat, lng }, arr) {
  let url = `https://www.google.com/maps/dir/${lat},${lng}`;

  arr.forEach((element) => {
    url += "/" + appendLocation(element);
  });

  return url;
}

function appendLocation({ number, name, type, suburb }) {
  return `${number}+${name}+${type},+${suburb}+QLD`;
}

const Markers = ({ setSelected, selected }) => {
  const { undelivered } = useSortedDelivery();

  const navigate = useNavigate();

  return useMemo(() => {
    return (
      undelivered
        // .filter((e, i) => i < 22)
        .map((street, i) => {
          const onClick = (e) => navigate(`/deliveries#${street.id}`);

          const isPickup = street.parcels.some((e) => e.color === "PICKUP");

          console.log({ n: street.number });

          const label = {
            className:
              "marker-label marker-label--" +
              (isPickup ? "p" : street.suburb[0].toLowerCase()),
            text: street.number === "" ? "_" : street.number,
          };
          const position = { lat: street.lat, lng: street.lng };

          const markerIcon = {
            path: icons.dot,
            fillColor: isPickup ? colors.PICKUP : colors[street.suburb[0]],
            fillOpacity: 0,
            scale: 2,
            strokeWeight: 0,
            labelOrigin: new window.google.maps.Point(10, 10),
            anchor: new window.google.maps.Point(15, 15),
          };

          return (
            <Marker
              onDblClick={onClick}
              onClick={() => {
                setSelected((s) => {
                  console.log({ s });
                  return [...s.filter((e) => e.id !== street.id), street];
                });
              }}
              key={street.id}
              options={{ optimized: true }}
              icon={markerIcon}
              position={position}
              label={label}
            />
          );
        })
    );
  }, [undelivered]);
};

const Suburbs = () =>
  useConst(
    () =>
      mapData.map((path, i) => {
        return <Polygon key={i} paths={path} options={options(i)} />;
      }),
    []
  );

const Overlay = () => {
  const { dispatch } = useDeliveryDb();
  const { closest } = useSortedDelivery();

  const street = useMemo(
    () => (
      <Street
        street={closest}
        toggle={() => {
          dispatch("toggle", closest.id);
        }}
        remove={() => dispatch("remove", closest.id)}
      />
    ),
    [closest, dispatch]
  );

  return <Flex p="0">{street}</Flex>;
};

const generateWaypoints = (undelivered) =>
  undelivered
    .filter((e, i) => i < 24)
    // .map(({ lat, lng }) => ({ lat, lng }))
    .map(({ number, name, type, suburb }) => ({
      location: `${number} ${name} ${type} ${suburb}`,
    }));
