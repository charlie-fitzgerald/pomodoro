import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import History from "./pages/History";
import Team from "./pages/Team";
import Billing from "./pages/Billing";
import ErrorPage from "./pages/ErrorPage";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "settings", element: <Settings /> },
      { path: "about", element: <About /> },
      { path: "history", element: <History /> },
      { path: "team", element: <Team /> },
      { path: "billing", element: <Billing /> },
    ],
  },
]);

export default router;
