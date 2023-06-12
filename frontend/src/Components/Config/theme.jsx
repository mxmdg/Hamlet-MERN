import * as React from "react";
import { ThemeOptions } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const themeMxm = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
      light: "#6573c3",
      dark: "#2c387e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057",
      light: "#f73378",
      dark: "#ab003c",
      contrastText: "#ffffff",
    },
    divider: "#fff",
    background: {
      paper: "#222222",
      default: "#121212",
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

const ThemeProv = (props) => {
  return <ThemeProvider theme={themeMxm}>{props.children}</ThemeProvider>;
};

export default ThemeProv;
