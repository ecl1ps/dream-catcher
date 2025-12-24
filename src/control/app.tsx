import { createRoot } from "react-dom/client";
import { ControlPanel } from "./ControlPanel";
import { AppProvider } from "./AppContext";

const root = createRoot(document.body);
root.render(
  <AppProvider>
    <ControlPanel />
  </AppProvider>,
);
