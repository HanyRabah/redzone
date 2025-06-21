import { createTheme } from "@mui/material";
import { Oswald, Open_Sans } from "next/font/google";

export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-open-sans",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#f70000",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          "&:hover": {
            innerScale: 0,
            outerScale: 10,
            color: "transparent",
            outerStyle: {
              boxShadow: "0 0 30px rgba(239,13,51, 0.8)",
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: oswald.style.fontFamily + ", " + openSans.style.fontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontSize: 16,
    h1: {
      fontSize: 48,
      fontWeight: 700,
    },
    h2: {
      fontSize: 36,
      fontWeight: 700,
    },
    h3: {
      fontSize: 24,
      fontWeight: 700,
    },
    h4: {
      fontSize: 20,
      fontWeight: 700,
    },
    h5: {
      fontSize: 16,
      fontWeight: 700,
    },
    h6: {
      fontSize: 14,
      fontWeight: 700,
    },
  },
});

export default theme;
