import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { SettingsContextProvider } from "./context/SettingsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsContextProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </SettingsContextProvider>
  </React.StrictMode>
);