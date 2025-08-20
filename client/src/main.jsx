import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import App from "./App";
import "./index.css";

const isProd = import.meta.env.MODE === "production";

const Root = (
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(
  isProd ? <React.StrictMode>{Root}</React.StrictMode> : Root
);
