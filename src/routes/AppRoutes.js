import {
  Routes,
  Route,
  Navigate,
  redirect,
  useLocation,
} from "react-router-dom";

import { Deliveries, NewParcel, Map, Settings, Streets } from "./pages";

import useInstallPWA from "../utils/hooks/useInstallPWA";
import { useEffect, useState } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import History from "./pages/History";
import Login from "../components/Login";

import { auth } from "../model";
import { useAuth } from "../utils/providers/AuthProvider";

export default function AppRoutes() {
  const { supportsPWA, promptInstall } = useInstallPWA();

  const location = useLocation();

  // const { isLoggedIn } = useAuth();

  if (supportsPWA) promptInstall?.prompt();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Redirect Screens */}
        <Route
          path="/"
          element={<Navigate to="/deliveries" replace={true} />}
        />
        <Route path="/new" element={<Navigate to="/new/1" replace={true} />} />

        {/* Main Screens */}
        <Route path="/deliveries" element={<Deliveries />}>
          <Route path=":id" element={<Deliveries />} />
        </Route>
        <Route path="/history" element={<History />}>
          <Route path=":id" element={<History />} />
        </Route>
        <Route path="/streets" element={<Streets />}>
          <Route path=":id" element={<Streets />} />
        </Route>
        <Route path="/map" element={<Map />}>
          <Route path=":id" element={<Map />} />
        </Route>

        {/* Menu screens */}
        <Route path="/settings" element={<Settings />}>
          <Route path=":id" element={<Settings />} />
        </Route>

        {/* Parameter screens */}
        <Route path="/new" element={<NewParcel />}>
          <Route path=":step" element={<NewParcel />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
