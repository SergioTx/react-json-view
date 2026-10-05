import { createRoot } from "react-dom/client";
import Index from "./index";

require("./../style/scss/global.scss");

const app = document.getElementById("mac-react-container");
if (!app) throw new Error("Documentation root container is missing");

// app entrypoint
createRoot(app).render(
  <div className="app-entry">
    <Index />
  </div>
);
