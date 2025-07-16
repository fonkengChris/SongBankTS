import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import theme from "./theme";
import { AuthProvider } from "./context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PWAUpdatePrompt from "./components/PWAUpdatePrompt";

const queryClient = new QueryClient();

console.log("Client ID:", import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ColorModeScript
      initialColorMode={theme.config.initialColorMode}
      storageKey="chakra-ui-color-mode"
    />
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || ""}
    >
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
            <PWAUpdatePrompt />
          </AuthProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ChakraProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
