import {
  GoogleMap,
  InfoWindow,
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
import { FaCross, FaInfoCircle } from "react-icons/fa";
import { MdCheck, MdClose, MdInfoOutline } from "react-icons/md";
import {
  BiCheck,
  BiChevronDown,
  BiChevronLeft,
  BiChevronRight,
  BiChevronUp,
  BiMinus,
  BiNavigation,
  BiPlus,
  BiReset,
} from "react-icons/bi";
import {
  BsFillCheckCircleFill,
  BsFillInfoCircleFill,
  BsFillInfoSquareFill,
} from "react-icons/bs";
import { RiInformationFill } from "react-icons/ri";
import { AiFillCloseCircle, AiFillCloseSquare } from "react-icons/ai";
import { Header } from "./Deliveries";

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
  pin: "M 185 476 c -17 -7 -43 -28 -58 -45 c -50 -60 -48 -144 8 -254 c 34 -68 103 -167 116 -167 c 4 0 32 37 62 83 c 118 178 126 295 25 370 c -33 25 -113 32 -153 13 z m 105 -116 c 11 -11 20 -29 20 -40 c 0 -26 -34 -60 -60 -60 c -26 0 -60 34 -60 60 c 0 11 9 29 20 40 c 11 11 29 20 40 20 c 11 0 29 -9 40 -20 z",
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
  height: "700px",
  margin: "0px",
  padding: "0px",
};

const MapOptions = {
  maxZoom: 20,
  gestureHandling: "cooperative",
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
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
  });

  const [selected, setSelected] = useState(
    "route" in localStorage ? JSON.parse(localStorage.getItem("route")) : []
  );

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem("route", JSON.stringify(selected));
  }, [selected]);

  const location = useMyPosition();
  const centre = useConst(
    () =>
      !location.error
        ? { lat: location.lat, lng: location.lng }
        : fallbackPosition,
    []
  );
  const { isEmpty, undelivered, closest, delivered } = useSortedDelivery();
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    setSelected((s) => {
      return s.filter((e) => undelivered.some(({ id }) => id === e));
    });
  }, [undelivered]);

  const [waypoints, setWaypoints] = useLocalStorage(
    "waypoints",
    generateWaypoints(undelivered)
  );

  const [zoom, setZoom] = useState(15);

  const selectedPlaces = selected.map((e) =>
    undelivered.find(({ id }) => e === id)
  );

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
    <Flex flexDir="column" w="100%" gap="2px">
      <Flex
        position="fixed"
        alignItems="center"
        justifyContent="center"
        w="calc(100% - 4px)"
        left="4px"
        top="0px"
        zIndex="500"
      >
        <Button
          zIndex="100"
          onClick={() => navigate(-1)}
          bg="white"
          w="50px"
          h="50px"
          p="0"
          fontSize="25px"
          color="green.800"
        >
          <BiChevronLeft />
        </Button>
        {(undelivered?.length > 0 || delivered?.length > 0) && (
          <Header isExpanded={false} setIsExpanded={setIsExpanded} />
        )}
      </Flex>

      <Zoom setZoom={setZoom} />

      {selected.length > 0 && (
        <Route
          selected={selectedPlaces}
          setSelected={setSelected}
          location={location}
          setHighlighted={setHighlighted}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
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

        <Markers setSelected={setSelected} selected={selectedPlaces} />
        <Suburbs />
      </GoogleMap>

      <Flex p="0 4px">
        <Overlay
          displayed={highlighted}
          setDisplayed={setHighlighted}
          selected={selectedPlaces}
          setSelected={setSelected}
        />
      </Flex>
    </Flex>
  );
}

const Route = ({
  selected = [],
  location,
  setSelected,
  setHighlighted,
  isExpanded,
  setIsExpanded,
}) => {
  const { dispatch } = useDeliveryDb();
  return (
    <Flex
      position="absolute"
      top="60px"
      left="8px"
      flexDirection="column"
      background="transparent"
      zIndex="300"
      gap="4px"
      alignItems="flex-end"
      borderRadius="16px"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        background="black"
        borderRadius="8px"
        overflow="hidden"
        color="white"
        h="40px"
      >
        <Button
          background="blue.300"
          onClick={() => setIsExpanded((e) => !e)}
          w="fit-content"
          h="50px"
          w="40%"
          p="0"
          borderRadius="0"
        >
          {isExpanded ? (
            <BiChevronLeft color="white" size="25px" />
          ) : (
            <BiChevronRight color="white" size="25px" />
          )}
        </Button>

        {isExpanded && (
          <Button
            background="red.300"
            onClick={() => setSelected([])}
            w="fit-content"
            h="50px"
            w="50%"
            p="0"
            borderRadius="0"
          >
            <BiReset color="white" size="25px" />
          </Button>
        )}
        <Button
          background="green.300"
          onClick={() =>
            window.open(getGoogleDirectionsLink(location, selected), "_blank")
          }
          w="fit-content"
          h="50px"
          w="50px"
          p="0"
          borderRadius="0"
          width="100%"
        >
          <BiNavigation color="white" size="25px" />
        </Button>
      </Flex>

      {isExpanded &&
        selected.map((e, i) => (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            gap="4px"
            w="100%"
            key={e.id}
            background="white"
            color="black"
            p="4px"
            borderRadius="8px"
            fontFamily='"Open Sans"'
          >
            <Flex gap="4px">
              <Text
                fontWeight="900"
                color="black"
                fontSize="16px"
                lineHeight="16px"
              >
                {e.number}
              </Text>
              <Text color="black" fontSize="12px" opacity="0.7">
                {e.name.toUpperCase()}
              </Text>
            </Flex>

            <Flex gap="4px" alignItems="center" justifyContent="flex-end">
              <BiChevronDown
                cursor="pointer"
                color={i === selected.length - 1 ? "transparent" : "black"}
                opacity="0.5"
                onClick={() => setSelected((s) => moveDown(s, e))}
                size="25px"
              />

              <BiChevronUp
                cursor="pointer"
                color={i === 0 ? "transparent" : "black"}
                opacity="0.5"
                onClick={() => setSelected((s) => moveUp(s, e))}
                size="25px"
              />
              <MdInfoOutline
                cursor="pointer"
                color="blue"
                onClick={() => setHighlighted((h) => e)}
                size="30px"
                opacity="0.5"
              />
            </Flex>
          </Flex>
        ))}
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

const Markers = ({ setSelected, selected, setHighlighted }) => {
  const { undelivered } = useSortedDelivery();

  const navigate = useNavigate();

  return useMemo(() => {
    return (
      // [
      undelivered
        //   {
        //     lat: -27.328031268580506,
        //     lng: 152.98566355337306,
        //     id: "1",
        //     name: "Brendale Depo CourierPlease",
        //     manual: true,
        //     parcels: [],
        //   },
        //   {
        //     lat: -27.461804985800843,
        //     lng: 153.02571603974496,
        //     id: "2",
        //     number: "170",
        //     name: "Leichhardt",
        //     type: "st",
        //     manual: true,
        //     parcels: [],
        //   },
        // ]
        .filter((e, i) => i < 30)
        .map((street, i) => (
          <CustomMarker {...{ navigate, street, selected, i, setSelected }} />
        ))
    );
  }, [undelivered, selected]);
};

const CustomMarker = ({ navigate, street, selected, setSelected, i }) => {
  const [showInfo, setShowInfo] = useState(false);

  const onClick = (e) => navigate(`/deliveries#${street.id}`);
  const num = selected
    .map(({ id }, i) => ({ id, i }))
    .find(({ id }) => id === street.id)?.i;

  const isPickup = street?.parcels?.some((e) => e.color === "PICKUP");
  const isSelected = typeof num === "undefined";

  //
  //

  const label = {
    className:
      "marker-label marker-label--" +
      (isPickup ? "p" : isSelected ? "black" : "red"),
    text: isSelected ? " " : num + 1 + "",
  };
  const position = { lat: street.lat, lng: street.lng };

  const markerIcon = {
    path: icons.pin,
    // fillColor: isPickup
    //   ? colors.PICKUP
    //   : isSelected
    //   ? "black"
    //   : colors[street.suburb[0]],
    fillOpacity: 0,
    scale: 1,
    strokeWeight: 0,
    fillColor: isPickup ? colors.PICKUP : isSelected ? "black" : "red",
    fillOpacity: 0.9,
    scale: 0.05,
    strokeColor: "gold",
    strokeWeight: 0,
    rotation: 180,
    labelOrigin: new window.google.maps.Point(250, 400),
    anchor: new window.google.maps.Point(250, 10),
  };
  return (
    <Marker
      // onDblClick={onClick}
      onClick={(e) => {
        setSelected((s) => {
          console.log({ s });
          const inRoute = s.some((id) => street.id === id);
          if (inRoute) return s.filter((id) => id !== street.id);

          console.log([...s, street.id], selected);
          return [...selected.map((e) => e.id), street.id];
        });
        setShowInfo(true);
      }}
      key={street.id}
      options={{ optimized: true }}
      icon={markerIcon}
      position={position}
      label={label}
      zIndex={i}
    />
  );
};

const Suburbs = () =>
  useConst(
    () =>
      mapData.map((path, i) => {
        return <Polygon key={i} paths={path} options={options(i)} />;
      }),
    []
  );

const Overlay = ({ displayed, setDisplayed, selected, setSelected }) => {
  const { dispatch } = useDeliveryDb();
  const { closest } = useSortedDelivery();

  const street = useMemo(() => {
    return (
      <Street
        street={closest}
        onComplete={() =>
          setSelected((s) => {
            return s.filter((e) => e !== closest.id);
          })
        }
      />
    );
  }, [displayed, dispatch, setDisplayed, closest]);

  return (
    <Flex flexDirection="column" w="100%" gap="16px">
      <Flex
        borderRadius="8px"
        position="absolute"
        w="calc(100vw - 32px)"
        zIndex="300"
        top="calc(100vh - 108px)"
        left="16px"
      >
        {street}
      </Flex>
      {/* <Flex>
        <Text weight="900" p="0 8px">
          Route
        </Text>
        <Flex>
          <Button>Reset</Button>
          <Button>Open Google</Button>
          <Button>Undo</Button>
          <Button>Bring Bottom to top</Button>
        </Flex>
      </Flex> */}
      {selected.map((e) => (
        <Street
          street={e}
          onComplete={() => setSelected((s) => s.filter((st) => st !== e.id))}
        ></Street>
      ))}
    </Flex>
  );
};

const generateWaypoints = (undelivered) =>
  undelivered
    .filter((e, i) => i < 24)
    // .map(({ lat, lng }) => ({ lat, lng }))
    .map(({ number, name, type, suburb }) => ({
      location: `${number} ${name} ${type} ${suburb}`,
    }));

const moveDown = (arr, item) => {
  const ind = arr.findIndex((id) => id === item.id);
  const newInd = ind + 1;
  console.log({ arr, item, ind, newInd });

  return arrayMove(arr, ind, newInd);
};

const moveUp = (arr, item) => {
  const ind = arr.findIndex((id) => id === item.id);
  const newInd = ind - 1;
  if (newInd < 0 || newInd === arr.length) return arr;

  return arrayMove(arr, ind, newInd);
};

const arrayMove = (arr, fromIndex, toIndex) => {
  const newArr = [...arr];
  newArr.splice(toIndex, 0, newArr.splice(fromIndex, 1)[0]);
  console.log({ arr, newArr });
  return newArr;
};

const Zoom = ({ setZoom }) => (
  <Flex position="absolute" top="60px" right="12px" zIndex="200" h="400px">
    <RangeSlider
      aria-label={["min", "max"]}
      defaultValue={[0, 30]}
      onChange={(val) => setZoom(12 + (8 * val[1]) / 100)}
      orientation="vertical"
      // h="200px"
    >
      <RangeSliderTrack bg="gray">
        <RangeSliderFilledTrack bg="green.800" />
      </RangeSliderTrack>
      <RangeSliderThumb index={1} />
    </RangeSlider>
  </Flex>
);
