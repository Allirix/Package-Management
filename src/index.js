import { LoadScript } from "@react-google-maps/api";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles.css";
import Provider from "./utils/providers";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Provider>
      <LoadScript googleMapsApiKey="AIzaSyDYWeSF4f4A-3gVJtrZdaRy7vfBF3Xq6TY">
        <App />
      </LoadScript>
    </Provider>
  </BrowserRouter>
);

serviceWorkerRegistration.register();
