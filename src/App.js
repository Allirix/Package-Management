import { BrowserRouter } from "react-router-dom";
import Navigation from "./components/Layout/Layout";

import AppRoutes from "./routes/AppRoutes";
import Provider from "./utils/providers";

export default () => (
  <BrowserRouter>
    <Provider>
      <Navigation>
        <AppRoutes />
      </Navigation>
    </Provider>
  </BrowserRouter>
);
