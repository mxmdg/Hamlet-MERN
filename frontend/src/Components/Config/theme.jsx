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

export const themeOptions = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e06",
    },
    secondary: {
      main: "#50e",
    },
    background: {
      default: "#0e5",
      paper: "#f056",
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

export const themeHamlet = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00796b",
      light: "#80cbc4",
      dark: "#004d40",
    },
    secondary: {
      main: "#0cb515",
      light: "#33691e",
      dark: "#18bf38",
    },
    background: {
      light: "#eeeeee",
      dark: "#010101",
    },
    error: {
      main: "#f50057",
      light: "#f32d72",
      dark: "#85002c",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#efc008",
      light: "#e9f556",
      dark: "#a78609",
    },
    info: {
      main: "#00b0ff",
      light: "#33bffe",
      dark: "#007bb5",
      contrastText: "#000000",
    },
    success: {
      main: "#5d8509",
      contrastText: "#ffffff",
      light: "#7d9d3b",
      dark: "#415d05",
    },
    divider: "#9a9a9a",
  },
});

const ThemeProv = (props) => {
  return <ThemeProvider theme={themeHamlet}>{props.children}</ThemeProvider>;
};

export default ThemeProv;
