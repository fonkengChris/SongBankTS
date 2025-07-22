import { createBrowserRouter, RouteObject } from "react-router-dom";
import NotationsManagementPage from "./admin_pages/NotationsManagemmentPage";
import CategoriesManagementPage from "./admin_pages/CategoriesManagementPage";
import CategoriesFormPage from "./admin_pages/CategoryFormPage";
import LanguagesManagementPage from "./admin_pages/LanguagesManagementPage";
import MediaFilesManagementPage from "./admin_pages/MediaFilesManagementPage";
import SongsManagementPage from "./admin_pages/SongsManagementPage";
import CustomersManagementPage from "./admin_pages/CustomersManagementPage";
import UsersManagementPage from "./admin_pages/UsersManagementPage";
import SongFormPage from "./admin_pages/SongFormPage";
import MediaFileFormPage from "./admin_pages/MediaFileFormPage";
import NotationFormPage from "./admin_pages/NotationFormPage";
import LanguageFormPage from "./admin_pages/LanguageFormPage";
import CustomerFormPage from "./admin_pages/CustomerFormPage";
import UserFormPage from "./admin_pages/UserFormPage";
import VideosManagementPage from "./admin_pages/VideosManagementPage";
import VideoFormPage from "./admin_pages/VideoFormPage";

// Define paths based on the links in your AdminPage component
const adminRoutes: RouteObject[] = [
  // Authentication and Authorization routes
  { path: "users", element: <UsersManagementPage /> },
  { path: "users/edit/:id", element: <UserFormPage /> },

  // Library routes
  {
    path: "category",
    element: <CategoriesManagementPage />,
  },
  { path: "categories/add", element: <CategoriesFormPage /> },
  { path: "categories/edit/:id", element: <CategoriesFormPage /> },
  {
    path: "customers",
    element: <CustomersManagementPage />,
  },
  { path: "customers/add", element: <CustomerFormPage /> },
  { path: "customers/edit/:id", element: <CustomerFormPage /> },
  { path: "songs", element: <SongsManagementPage /> },
  { path: "songs/add", element: <SongFormPage /> },
  { path: "songs/edit/:id", element: <SongFormPage /> },
  {
    path: "notations",
    element: <NotationsManagementPage />,
  },
  { path: "notations/add", element: <NotationFormPage /> },
  { path: "notations/edit/:id", element: <NotationFormPage /> },
  {
    path: "languages",
    element: <LanguagesManagementPage />,
  },
  { path: "languages/add", element: <LanguageFormPage /> },
  { path: "languages/edit/:id", element: <LanguageFormPage /> },
  {
    path: "media_files",
    element: <MediaFilesManagementPage />,
  },
  {
    path: "media_files/add",
    element: <MediaFileFormPage />,
  },
  {
    path: "media_files/edit/:id",
    element: <MediaFileFormPage />,
  },
  {
    path: "videos",
    element: <VideosManagementPage />,
  },
  { path: "videos/add", element: <VideoFormPage /> },
  { path: "videos/edit/:id", element: <VideoFormPage /> },
];

export default adminRoutes;
