import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <ColorModeScript
        initialColorMode={theme.config.initialColorMode}
      ></ColorModeScript>
      <BrowserRouter>
        {/* <AuthProvider> */}
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
        {/*  </AuthProvider> */}
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
