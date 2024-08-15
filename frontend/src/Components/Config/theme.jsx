import * as React from "react";
import { ThemeOptions } from "@mui/material/styles";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";

//Color Pallete Checker http://a11yrocks.com/colorPalette/
// #3f51b5,#f50057,#ff1744,#29b6f8,#66bb6a,#222222
//0.0.988
//d4b0108
export const themeMxm = createTheme({
  spacing: 4,
  palette: {
    mode: "dark",
    primary: {
      main: "#59e3ea",
      light: "#5ad3ff",
      dark: "#26a3aa",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f87527",
      light: "#f73378",
      dark: "#ab003c",
      contrastText: "#ffffff",
    },
    divider: "#fff",
    background: {
      paper: "#222222",
      default: "#aef",
    },
    text: {
      primary: "#ffffff",
      secondary: "#dddddd",
      disabled: "#888888",
      hint: "#aaffff",
    },
    error: {
      main: "#ff1744",
      light: "#ff4569",
      dark: "#b2102f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffa727",
      light: "#ffb851",
      dark: "#b2741a",
      contrastText: "#291a05",
    },
    info: {
      main: "#29b6f8",
      light: "#53c4fa",
      dark: "#1c7fae",
      contrastText: "#092a3b",
    },
    success: {
      main: "#66bb6a",
      light: "#84ca87",
      dark: "#478f4a",
      contrastText: "#162910",
    },
  },
});

const themeOptions = createTheme({
  palette: {
    mode: "dark",
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
      main: "#5d9948",
      light: "#b2e068",
      dark: "#204227",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: 16,
    button: {
      fontWeight: 600,
      fontSize: "1.1rem",
      fontFamily: "Roboto, sans-serif",
    },
    h6: {
      fontFamily: "Montserrat, sans-serif",
      fontWeight: 900,
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

const ThemeProv = (props) => {
  themeOptions.palette.mode = props.mode ? "dark" : "light";
  if (props.mode) {
    themeOptions.palette.mode = "dark";
    themeOptions.palette.background = {
      default: "#ede7de",
      paper: "#000000",
    };
    themeOptions.palette.text = {
      primary: "#ffffff",
      secondary: "#aaaaaa",
      disabled: "#888888",
      hint: "#000000",
    };
  } else {
    themeOptions.palette.mode = "light";
    themeOptions.palette.background = {
      default: "#000",
      paper: "#F7FBEF",
    };
    themeOptions.palette.text = {
      primary: "#222",
      secondary: "#333",
      disabled: "#666",
      hint: "#098",
    };
  }

  return <ThemeProvider theme={themeOptions}>{props.children}</ThemeProvider>;
};
export { themeOptions };
export default ThemeProv;
