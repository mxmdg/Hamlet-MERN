import * as React from "react";
import { ThemeOptions } from "@mui/material/styles";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { themeIndependiente, themeBocaJuniors } from "./TemasAFA";

//Color Pallete Checker http://a11yrocks.com/colorPalette/
// #3f51b5,#f50057,#ff1744,#29b6f8,#66bb6a,#222222
//0.0.988
//d4b0108
const storedTheme = localStorage.getItem("appTheme");
const initialMode = storedTheme ? storedTheme : "light"; // o "light", según lo que necesites

export const themeMxm = createTheme({
  spacing: 4,
  palette: {
    mode: initialMode,
    primary: {
      main: "#09b4bd", // adjusted for better contrast
      light: "#00e3e3",
      dark: "#1c8a90",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#bd00b4", // adjusted for better contrast
      light: "#e42d5d",
      dark: "#900032",
      contrastText: "#ffffff",
    },
    divider: "#fff",
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
      main: "#3eceee", // adjusted for better contrast
      light: "#46aefa",
      dark: "#17648e",
      contrastText: "#092a3b",
    },
    success: {
      main: "#2e7d32", // Verde principal (oscuro y elegante)
      light: "#60ad5e", // Verde claro
      dark: "rgb(15, 64, 69)", // Verde más oscuro
      contrastText: "#ffffff", // Texto blanco para buen contraste
    },

    background:
      initialMode === "light"
        ? {
            paper: "#fff", // white paper for light mode
            default: "linear-gradient(45deg, #D9AFD9 0%, #97D9E1 100%)",
          }
        : {
            paper: "#222", // dark paper for dark mode
            default: "linear-gradient(135deg, #06222d 0%, #1f003b 100%)",
          },
  },
});

export const themeOptions = createTheme({
  spacing: 1,
  palette: {
    mode: initialMode,
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

    background:
      initialMode === "light"
        ? {
            paper: "#ca7", // white paper for light mode
            default: "linear-gradient(45deg, #D9AFD9 0%, #97D9E1 100%)",
          }
        : {
            paper: "#222", // dark paper for dark mode
            default: "linear-gradient(135deg, #06222d 0%, #1f003b 100%)",
          },
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

const ThemeProv = (props) => {
  //props.theme.palette.mode = props.mode ? "light" : "dark";
  if (props.mode === "light") {
    props.theme.palette.mode = "light";
    props.theme.palette.background = {
      default: "linear-gradient(135deg, #06222d 0%, #1f003b 100%)",
      // default: "linear-gradient(45deg, #D9AFD9 0%, #97D9E1 100%)",
      paper: "#edf6e3ff",
    };
    props.theme.palette.text = {
      primary: "#000",
      secondary: "#000",
      disabled: "#aaa",
      hint: "#067",
    };
  } else if (props.mode === "dark") {
    props.theme.palette.mode = "dark";
    props.theme.palette.background = {
      //default: "linear-gradient(135deg, #06222d 0%, #1f003b 100%)",
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

  //return <ThemeProvider theme={themeOptions}>{props.children}</ThemeProvider>;
  return <ThemeProvider theme={themeMxm}>{props.children}</ThemeProvider>;
};

export default ThemeProv;
