import {
  GoogleMap,
  Marker,
  Polygon,
  useLoadScript,
  // DirectionsService,
} from "@react-google-maps/api";

import map from "../../data/map.json";

import { Flex, Spinner, useConst } from "@chakra-ui/react";

import Street from "../../components/Deliveries/Place";

import "../../components/Map/Map.css";

import { useEffect, useMemo } from "react";
import {
  useDeliveryDb,
  useMyPosition,
  useSortedDelivery,
} from "../../utils/providers";
import FirstDelivery from "../../components/FirstDelivery";
import useLocalStorage from "../../utils/hooks/useLocalStorage";
import { Loading } from "../../components/Layout/Layout";

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
};

const colors = {
  G: "green",
  U: "blue",
  K: "magenta",
  M: "red",
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
    googleMapsApiKey:
      process.env.GOOGLE_KEY || "AIzaSyDYWeSF4f4A-3gVJtrZdaRy7vfBF3Xq6TY",
  });

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
      <GoogleMap
        center={centre}
        zoom={15}
        style={containerStyle}
        id="map"
        options={MapOptions}
      >
        <Marker icon={currentPositionIcon} position={location} />
        <Markers />
        <Suburbs />
      </GoogleMap>
      <Overlay />
      {/* {distanceMatrix} */}
    </Flex>
  );
}

const Markers = () => {
  const { undelivered } = useSortedDelivery();

  const onClick = (e) => {
    console.log(e);
  };

  console.log({ undelivered });

  return useMemo(() => {
    return undelivered
      .filter((e, i) => i < 22)
      .map((street, i) => {
        console.log(street);
        const label = {
          className:
            "marker-label marker-label--" + street.suburb[0].toLowerCase(),
          text: i + "",
        };
        const position = { lat: street.lat, lng: street.lng };
        const markerIcon = {
          path: icons.dot,
          fillColor: colors[street.suburb[0]],
          fillOpacity: 0.9,
          scale: 0.3,
          strokeWeight: 0,
        };
        return (
          <Marker
            onClick={onClick}
            key={i}
            options={{ optimized: true }}
            icon={markerIcon}
            position={position}
            label={label}
          />
        );
      });
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
