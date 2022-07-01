import ListView from "./components/ListView";
import LocationsView from "./components/LocationsView/Locations";
import MapView from "./components/MapView/Map";
import Navigation from "./components/Navigation";
import Settings from "./components/Settings";
import Location from "./components/LocationsView/Locations";

import { Routes, Route } from "react-router-dom";
import NewParcel from "./components/NewParcel/NewParcel";
import Camera from "./components/camera/Camera";

const pages = {
  nav: [
    {
      path: "home",
      element: <ListView />,
    },
    { path: "map", element: <MapView /> },
    { path: "locations", element: <Location /> },
  ],
  menu: [
    { path: "locations", element: <LocationsView /> },
    { path: "settings", element: <Settings /> },
  ],
};

pages.all = Object.keys(pages).reduce(
  (acc, key) => [...acc, ...pages[key]],
  []
);

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ListView />} />
        {pages.all.map(({ element, path }, id) => (
          <Route {...{ element, path }} key={`pg${id}`} />
        ))}

        <Route path="/new" element={<NewParcel />}>
          <Route path=":formState" element={<NewParcel />} />
        </Route>
      </Routes>
      <Navigation {...{ pages: pages.nav }} />
    </div>
  );
}
