Thank you for providing additional files. Below is the updated README.md for your SongBankTS project:

---

# SongBankTS

SongBankTS is a web-based song library application built using React and TypeScript. It allows users to browse, search, and manage a collection of songs. The project utilizes a variety of modern web technologies to deliver a seamless user experience.

## Features

- Browse and search for songs
- View song details
- User authentication and authorization
- Responsive design with Chakra UI
- State management with Zustand
- Data fetching with React Query
- Smooth animations with Framer Motion

## Technologies Used

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Chakra UI**: Component library for React
- **React Router**: Declarative routing for React
- **React Query**: Data-fetching library for React
- **Zustand**: Small, fast state-management library
- **Axios**: Promise-based HTTP client
- **Vite**: Next-generation frontend tooling

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/fonkengChris/SongBankTS.git
    cd SongBankTS
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

## Running the Project

### Development Server

To start the development server, run:

```bash
npm run dev
```

### Production Build

To build the project for production, run:

```bash
npm run build
```

### Preview Production Build

To preview the production build, run:

```bash
npm run preview
```

## Folder Structure

```plaintext
songbankts/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── store/
│   ├── theme/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .eslintrc.js
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Usage

### Main Application Entry (src/main.tsx)

```tsx
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import theme from "./theme";
import { AuthProvider } from "./context/AuthProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
```

### Routing (src/Routes.tsx)

```tsx
import { createBrowserRouter } from "react-router-dom";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import SongsPage from "./pages/SongsPage";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import SongDetialPage from "./pages/SongDetialPage";
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
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "contact", element: <Contact /> },
      { path: "upload", element: <UploadSong /> },
      { path: "change_password", element: <ChangePassword /> },
      { path: "users/:id", element: <UserProfile /> },
      { path: "edit_profile", element: <EditProfile /> },
      { path: "songs", element: <SongsPage /> },
      { path: "songs/:id", element: <SongDetialPage /> },
    ],
  },
]);

export default router;
```

### Zustand Store (src/store/useSongQueryStore.ts)

```tsx
import { create } from "zustand";

export interface SongQuery {
  categoryId?: number | null;
  notationId?: number | null;
  languageId?: number | null;
  sortOrder?: string;
  searchText?: string;
}

interface SongQueryStore {
  songQuery: SongQuery;
  setCategoryId: (categoryId: number | null) => void;
  setNotationId: (notationId: number | null) => void;
  setLanguageId: (languageId: number | null) => void;
  setSortOrder: (sortOrder: string) => void;
  setSearchText: (searchText: string) => void;
}

const useSongQueryStore = create<SongQueryStore>((set) => ({
  songQuery: {},
  setSearchText: (searchText) => set(() => ({ songQuery: { searchText } })),
  setCategoryId: (categoryId) =>
    set((store) => ({ songQuery: { ...store.songQuery, categoryId } })),
  setNotationId: (notationId) =>
    set((store) => ({ songQuery: { ...store.songQuery, notationId } })),
  setLanguageId: (languageId) =>
    set((store) => ({ songQuery: { ...store.songQuery, languageId } })),
  setSortOrder: (sortOrder) =>
    set((store) => ({ songQuery: { ...store.songQuery, sortOrder } })),
}));

export default useSongQueryStore;
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

---
