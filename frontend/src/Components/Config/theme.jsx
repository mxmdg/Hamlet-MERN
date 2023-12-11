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

export const themeOptions = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#009688",
      light: "#64ffda",
      dark: "#006056",
      contrastText: "#000000",
    },
    secondary: {
      main: "#d500f9",
      light: "#ea80fc",
      dark: "#7b1fa2",
      contrastText: "#f3e5f5",
    },
    error: {
      main: "#ec407a",
      light: "#f48fb1",
      dark: "#880e4f",
    },
    warning: {
      main: "#f9a825",
      light: "#ffff00",
      dark: "#ffab00",
      contrastText: "rgba(2,2,2,0.87)",
    },
    info: {
      main: "#00b8d4",
      light: "#18ffff",
      dark: "#0097a7",
    },
    success: {
      main: "#64dd17",
      light: "#00e676",
      dark: "#388e3c",
    },
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
      default: "#121212",
      paper: "#212121",
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
      default: "#ddd",
      paper: "#eee",
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

export default ThemeProv;
