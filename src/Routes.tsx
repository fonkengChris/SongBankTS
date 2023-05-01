import { createBrowserRouter } from "react-router-dom";
import Logout from "./components/Logout";
import Register from "./components/Register";
import ErrorPage from "./pages/ErrorPage";
import SongsPage from "./pages/SongsPage";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import SongDetialPage from "./pages/SongDetialPage";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      // { path: "users/:id", element: <UserProfile /> },
      { path: "songs/", element: <SongsPage /> },
      { path: "songs/:id", element: <SongDetialPage /> },
    ],
  },
]);

export default router;
