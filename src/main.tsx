import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.tsx";
import "./index.css";
import ToastContextProvider from "./Context/ToastContext.tsx";
import { SidebarProvider } from "./Context/SideBarContext.tsx";
import AuthContextProvider from "./Context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <ToastContextProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ToastContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
