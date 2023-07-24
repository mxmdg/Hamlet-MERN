import * as React from "react";
import { ThemeOptions } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

//Color Pallete Checker http://a11yrocks.com/colorPalette/
// #3f51b5,#f50057,#ff1744,#29b6f8,#66bb6a,#222222

export const themeMxm = createTheme({
  spacing: 4,
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
      light: "#6573c3",
      dark: "#2c387e",
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

export const themeOptions = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5893df",
    },
    secondary: {
      main: "#2ec5d3",
    },
    background: {
      default: "#192231",
      paper: "#24344d",
    },
  },
});

export const themeGreen = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00796b",
      light: "#80cbc4",
      dark: "#004d40",
    },
    secondary: {
      main: "#76ff03",
      light: "#33691e",
      dark: "#b2ff59",
    },
    background: {
      paper: "#e0e0e0",
      default: "#bdbdbd",
    },
    error: {
      main: "#f50057",
    },
    warning: {
      main: "#ff3d00",
    },
    info: {
      main: "#00b0ff",
    },
    success: {
      main: "#64dd17",
    },
  },
});

const ThemeProv = (props) => {
  return <ThemeProvider theme={themeOptions}>{props.children}</ThemeProvider>;
};

export default ThemeProv;
