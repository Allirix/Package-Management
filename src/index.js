import { createRoot } from "react-dom/client";
import { register } from "./service-worker/serviceWorkerRegistration";
import "./model";

import App from "./App";
import "./index.css";

// render react app to <div id="root"/>
createRoot(document.getElementById("root")).render(<App />);

// register service worker
register();
