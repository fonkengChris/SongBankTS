import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === "dark" ? "black" : "white",
      },
    }),
  },
  colors: {
    gray: {
      50: "#f9f9f9",
      100: "#ededed",
      200: "#d3d3d3",
      300: "#b3b3b3",
      400: "#a0a0a0",
      500: "#898989",
      600: "#6c6c6c",
      700: "#202020",
      800: "#121212",
      900: "#000000",
    },
    blue: {
      50: "#e6f3ff",
      100: "#bde0ff",
      200: "#94cdff",
      300: "#6bbaff",
      400: "#42a7ff",
      500: "#1994ff",
      600: "#0076e6",
      700: "#0058ad",
      800: "#003b74",
      900: "#001d3b",
      950: "#00142b",
    },
  },
  components: {
    Box: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === "dark" ? "black" : "white",
      }),
    },
  },
});

export default theme;
