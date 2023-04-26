import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import SongDetialPage from "./pages/SongDetialPage";
import Register from "./components/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "songs/:id", element: <SongDetialPage /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default router;
