import { createBrowserRouter } from "react-router-dom";
import Logout from "./components/Logout";
import Register from "./components/Register";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import SongDetialPage from "./pages/SongDetialPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "songs/:id", element: <SongDetialPage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

export default router;
