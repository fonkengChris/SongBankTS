import { createBrowserRouter } from "react-router-dom";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import SongsPage from "./pages/SongsPage";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import SongDetailPage from "./pages/SongDetailPage";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import ChangePassword from "./components/ChangePassword";
import EditProfile from "./pages/EditProfile";
import Contact from "./pages/Contact";
import UploadSong from "./pages/UploadSong";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <Register /> },
      { path: "auth", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "contact", element: <Contact /> },
      { path: "upload", element: <UploadSong /> },
      { path: "change_password", element: <ChangePassword /> },
      { path: "users/:id", element: <UserProfile /> },
      { path: "edit_profile", element: <EditProfile /> },
      { path: "songs", element: <SongsPage /> },
      { path: "/media_files/:id", element: <SongDetailPage /> },
    ],
  },
]);

export default router;
