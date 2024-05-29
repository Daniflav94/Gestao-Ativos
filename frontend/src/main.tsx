import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Assets } from "./pages/assets/index.tsx";
import { AssetsManagement } from "./pages/assets_management/index.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { Collaborators } from "./pages/collaborators/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    
    children: [
      {
        path: "/ativos",
        element: <Assets />,
      },
      {
        path: "/",
        element: <AssetsManagement />,
      },
      {
        path: "/colaboradores",
        element: <Collaborators />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>
);
