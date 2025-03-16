import * as React from "react";
import { ThemeOptions } from "@mui/material/styles";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { themeIndependiente, themeBocaJuniors } from "./TemasAFA";

//Color Pallete Checker http://a11yrocks.com/colorPalette/
// #3f51b5,#f50057,#ff1744,#29b6f8,#66bb6a,#222222
//0.0.988
//d4b0108
export const themeMxm = createTheme({
  spacing: 4,
  palette: {
    mode: "dark",
    primary: {
      main: "#09b4bd", // adjusted for better contrast
      light: "#00e3e3",
      dark: "#1c8a90",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e86622", // adjusted for better contrast
      light: "#e42d5d",
      dark: "#900032",
      contrastText: "#ffffff",
    },
    divider: "#fff",
    background: {
      paper: "#222222",
      default: "#9cf", // adjusted for better contrast
    },
    text: {
      primary: "#ffffff",
      secondary: "#cccccc",
      disabled: "#777777", // adjusted for better contrast
      hint: "#99ffff",
    },
    error: {
      main: "#e31436", // adjusted for better contrast
      light: "#e32f59",
      dark: "#99122a",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9727", // adjusted for better contrast
      light: "#ffa44b",
      dark: "#a5611a",
      contrastText: "#291a05",
    },
    info: {
      main: "#1ba0e6", // adjusted for better contrast
      light: "#46aefa",
      dark: "#17648e",
      contrastText: "#092a3b",
    },
    success: {
      main: "#57a95b", // adjusted for better contrast
      light: "#73b978",
      dark: "#3d6d3e",
      contrastText: "#162910",
    },
    background: {
      default: "linear-gradient(45deg, #D9AFD9 0%, #97D9E1 100%)",
      paper: "rgb(240, 234, 231)",
    },
  },
});

const themeOptions = createTheme({
  palette: {
    mode: "light",
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
  //props.theme.palette.mode = props.mode ? "light" : "dark";
  if (props.mode) {
    props.theme.palette.mode = "light";
    props.theme.palette.background = {
      default: "linear-gradient(135deg, #06222d 0%, #1f003b 100%)",
      paper: "rgb(255, 255, 255)",
    };
    props.theme.palette.text = {
      primary: "#000",
      secondary: "#000",
      disabled: "#aaa",
      hint: "#067",
    };
  } else {
    props.theme.palette.mode = "dark";
    props.theme.palette.background = {
      default: "linear-gradient(45deg, #D9AFD9 0%, #97D9E1 100%)",
      paper: " #06222d",
    };
    props.theme.palette.text = {
      primary: "#eee",
      secondary: "#3ef",
      disabled: "#888",
      hint: "#0ab",
    };
  }

  //background-color: #D9AFD9;
  //background-image: linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%);

  return <ThemeProvider theme={themeMxm}>{props.children}</ThemeProvider>;
};
export { themeOptions };
export default ThemeProv;
