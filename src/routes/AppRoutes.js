import { Routes, Route, Navigate } from "react-router-dom";

import { Deliveries, NewParcel, Map, Settings, Streets } from "./pages";

import useInstallPWA from "../utils/hooks/useInstallPWA";

export default function AppRoutes() {
  const { supportsPWA, promptInstall } = useInstallPWA();
  if (supportsPWA) promptInstall?.prompt();

  return (
    <Routes>
      {/* Redirect Screens */}
      <Route path="/" element={<Navigate to="/deliveries" replace={true} />} />
      <Route path="/new" element={<Navigate to="/new/0" replace={true} />} />

      {/* Main Screens */}
      <Route path="/deliveries" element={<Deliveries />} />
      <Route path="/map" element={<Map />} />

      {/* Menu screens */}
      <Route path="/streets" element={<Streets />} />
      <Route path="/settings" element={<Settings />} />

      {/* Parameter screens */}
      <Route path="/new" element={<NewParcel />}>
        <Route path=":step" element={<NewParcel />} />
      </Route>
    </Routes>
  );
}
