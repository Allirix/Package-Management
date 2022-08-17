import { useState, useEffect } from "react";

export default function useMyPosition() {
  // https://www.npmjs.com/package/react-geolocated

  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const onChange = ({ coords: { latitude, longitude } }) => {
    setPosition({
      lat: latitude,
      lng: longitude,
    });
  };
  const onError = (error) => {
    setError(error.message);
  };
  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);

  return { ...position, error };
}
