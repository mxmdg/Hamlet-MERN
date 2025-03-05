import * as React from "react";
import { ThemeOptions } from "@mui/material/styles";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";

export const themeIndependiente = createTheme({
  spacing: 4,
  palette: {
    mode: "light",
    primary: {
      main: "#e20e0e", // Rojo Independiente
      light: "#ff3333",
      dark: "#a70000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff", // Blanco
      light: "#ffffff",
      dark: "#e0e0e0",
      contrastText: "#e20e0e", // Contraste con el rojo
    },
    divider: "#e20e0e",
    background: {
      paper: "#f5f5f5", // Fondo claro
      default: "#ffffff", // Fondo principal
    },
    text: {
      primary: "#e20e0e", // Texto principal en rojo
      secondary: "#a70000", // Texto secundario en rojo oscuro
      disabled: "#cccccc", // Texto deshabilitado en gris claro
      hint: "#ff6666", // Pistas en rojo claro
    },
    error: {
      main: "#d32f2f", // Rojo oscuro
      light: "#ff6659",
      dark: "#9a0007",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffa000", // Naranja
      light: "#ffc107",
      dark: "#e65100",
      contrastText: "#ffffff",
    },
    info: {
      main: "#1976d2", // Azul
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#ffffff",
    },
    success: {
      main: "#388e3c", // Verde
      light: "#66bb6a",
      dark: "#2e7d32",
      contrastText: "#ffffff",
    },
    background: {
      default: "linear-gradient(45deg, #e20e0e 0%, #ffffff 100%)", // Degradado rojo a blanco
      paper: "rgb(245, 245, 245)",
    },
  },
});

export const themeBocaJuniors = createTheme({
  spacing: 4,
  palette: {
    mode: "light",
    primary: {
      main: "#004aad", // Azul Boca Juniors
      light: "#337bff",
      dark: "#003080",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffcb00", // Amarillo Boca Juniors
      light: "#ffe066",
      dark: "#b78e00",
      contrastText: "#004aad", // Contraste con el azul
    },
    divider: "#004aad",
    background: {
      paper: "#f5f5f5", // Fondo claro
      default: "#ffffff", // Fondo principal
    },
    text: {
      primary: "#004aad", // Texto principal en azul
      secondary: "#003080", // Texto secundario en azul oscuro
      disabled: "#cccccc", // Texto deshabilitado en gris claro
      hint: "#337bff", // Pistas en azul claro
    },
    error: {
      main: "#d32f2f", // Rojo oscuro
      light: "#ff6659",
      dark: "#9a0007",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffa000", // Naranja
      light: "#ffc107",
      dark: "#e65100",
      contrastText: "#ffffff",
    },
    info: {
      main: "#1976d2", // Azul
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#ffffff",
    },
    success: {
      main: "#388e3c", // Verde
      light: "#66bb6a",
      dark: "#2e7d32",
      contrastText: "#ffffff",
    },
    background: {
      default: "linear-gradient(45deg, #004aad 0%, #ffcb00 100%)", // Degradado azul a amarillo
      paper: "rgb(245, 245, 245)",
    },
  },
});
