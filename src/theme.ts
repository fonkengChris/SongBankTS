import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  disableTransitionOnChange: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
    mono: `'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace`,
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    normal: "normal",
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: "2",
    "3": ".75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: "#000000",
        color: "white",
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontSize: "16px",
        lineHeight: "1.6",
        fontWeight: "400",
        letterSpacing: "normal",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      html: {
        bg: "#000000",
      },
      "*": {
        transition: "none !important",
      },
      h1: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "700",
        lineHeight: "1.2",
        letterSpacing: "-0.02em",
      },
      h2: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "600",
        lineHeight: "1.3",
        letterSpacing: "-0.01em",
      },
      h3: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "600",
        lineHeight: "1.4",
      },
      p: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "400",
        lineHeight: "1.6",
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
      800: "#000000",
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
      baseStyle: (props: any) => ({
        bg: "#000000",
      }),
    },
    Heading: {
      baseStyle: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "700",
        letterSpacing: "-0.02em",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      variants: {
        h1: {
          fontSize: { base: "2xl", md: "4xl", lg: "5xl" },
          lineHeight: "1.1",
          fontWeight: "800",
          letterSpacing: "-0.03em",
        },
        h2: {
          fontSize: { base: "xl", md: "3xl", lg: "4xl" },
          lineHeight: "1.2",
          fontWeight: "700",
          letterSpacing: "-0.02em",
        },
        h3: {
          fontSize: { base: "lg", md: "2xl", lg: "3xl" },
          lineHeight: "1.3",
          fontWeight: "600",
          letterSpacing: "-0.01em",
        },
      },
    },
    Text: {
      baseStyle: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "400",
        lineHeight: "1.6",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      variants: {
        body: {
          fontSize: "md",
          lineHeight: "1.6",
        },
        caption: {
          fontSize: "sm",
          lineHeight: "1.5",
          color: "gray.400",
        },
        subtitle: {
          fontSize: "lg",
          lineHeight: "1.5",
          fontWeight: "500",
        },
      },
    },
    Button: {
      baseStyle: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "600",
        letterSpacing: "0.01em",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
    Input: {
      baseStyle: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "400",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
    Textarea: {
      baseStyle: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "400",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
    Link: {
      baseStyle: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
        fontWeight: "500",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
  },
});

export default theme;
