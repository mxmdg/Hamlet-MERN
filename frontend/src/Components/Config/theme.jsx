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
      main: "#00eeaf",
      light: "#64ffda",
      dark: "#006056",
      contrastText: "#000000",
    },
    secondary: {
      main: "#ea00fe",
      light: "#ea80fc",
      dark: "#7b1fa2",
      contrastText: "#f3e5f5",
    },
    error: {
      main: "#ff6099",
      light: "#f48fb1",
      dark: "#880e4f",
    },
    warning: {
      main: "#fb4",
      light: "#D36308",
      dark: "#fa0",
      contrastText: "rgba(2,2,2,0.87)",
    },
    info: {
      main: "#00bbff",
      light: "#18ffff",
      dark: "#09f",
      contrastText: "#fff",
    },
    success: {
      main: "#6f2",
      light: "#00e676",
      dark: "#388e3c",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "Open Sans, sans-serif",
    button: {
      fontWeight: 500,
      fontSize: "0.9rem",
      fontFamily: "Open Sans, sans-serif",
    },
    h1: {
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 700,
    },
    fontWeightLight: 100,
    fontWeightRegular: 500,
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
      default: "#EEF5DB",
      paper: "#000000",
    };
    themeOptions.palette.text = {
      primary: "#cccccc",
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
