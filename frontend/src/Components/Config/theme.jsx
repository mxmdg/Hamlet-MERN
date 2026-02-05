import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

//Color Pallete Checker http://a11yrocks.com/colorPalette/
// #3f51b5,#f50057,#ff1744,#29b6f8,#66bb6a,#222222
//0.0.988
//d4b0108
const lightBackground = {
  paper: "#edf6e3ff",
  default: "linear-gradient(45deg, #D9AFD9 0%, #97D9E1 100%)",
};

const darkBackground = {
  paper: "#06222d",
  default: "linear-gradient(135deg, #06222d 0%, #1f003b 100%)",
};

const lightText = {
  primary: "#000",
  secondary: "#000",
  disabled: "#aaa",
  hint: "#067",
};

const darkText = {
  primary: "#eee",
  secondary: "#3ef",
  disabled: "#888",
  hint: "#0ab",
};

export const createMxmTheme = (mode = "light") =>
  createTheme({
    spacing: 4,
    palette: {
      mode,
      primary: {
        main: "#09b4bd",
        light: "#00e3e3",
        dark: "#1c8a90",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#bd00b4",
        light: "#e42d5d",
        dark: "#900032",
        contrastText: "#ffffff",
      },
      divider: "#fff",
      text: mode === "dark" ? darkText : lightText,
      error: {
        main: "#e31436",
        light: "#e32f59",
        dark: "#99122a",
        contrastText: "#ffffff",
      },
      warning: {
        main: "#ff9727",
        light: "#ffa44b",
        dark: "#a5611a",
        contrastText: "#291a05",
      },
      info: {
        main: "#3eceee",
        light: "#46aefa",
        dark: "#17648e",
        contrastText: "#092a3b",
      },
      success: {
        main: "#95d420e3",
        light: "#d0f19aff",
        dark: "#79910fff",
        contrastText: "#fff",
      },
      background: mode === "dark" ? darkBackground : lightBackground,
    },
  });

export const createThemeOptions = (mode = "light") =>
  createTheme({
    spacing: 1,
    palette: {
      mode,
      primary: {
        main: "#26c2a3",
        light: "#62f6ca",
        dark: "#109888",
        contrastText: "#000000",
      },
      secondary: {
        main: "#7a66f4",
        light: "#9881f2",
        dark: "#303d8a",
        contrastText: "#f3e5f5",
      },
      error: {
        main: "#ed2456",
        light: "#ff788a",
        dark: "#940c45",
      },
      warning: {
        main: "#f7c631",
        light: "#fce26a",
        dark: "#cf8d1b",
        contrastText: "rgba(2,2,1)",
      },
      info: {
        main: "#009fd9",
        light: "#4dc3ea",
        dark: "#0b548c",
        contrastText: "#fff",
      },
      success: {
        main: "#b0ff1eff",
        light: "#d0f19aff",
        dark: "#a0c209ff",
        contrastText: "#fff",
      },

      background: mode === "dark" ? darkBackground : lightBackground,
    },
    typography: {
      fontFamily: "Montserrat, sans-serif",
      fontSize: 14,
      button: {
        fontWeight: 500,
        fontSize: 12,
        fontFamily: "Roboto, sans-serif",
      },
      h6: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 500,
      },
      fontWeightLight: 100,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
      fontWeightBold: 900,
    },
  });

/* const ThemeProv = (props) => {
  return <ThemeProvider theme={themeHamlet}>{props.children}</ThemeProvider>;
};
export default ThemeProv; */

const ThemeProv = ({ mode, theme, children }) => {
  const resolvedTheme = React.useMemo(
    () => theme ?? createMxmTheme(mode),
    [theme, mode],
  );
  return <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>;
};

export default ThemeProv;
