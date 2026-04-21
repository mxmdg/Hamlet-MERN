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

export const createMintPulseTheme = (mode = "light") =>
  createTheme({
    spacing: 4,
    palette: {
      mode,
      primary: {
        main: "#8ff5d8",
        light: "#b2f9e6",
        dark: "#64cdb1",
        contrastText: "#052018",
      },
      secondary: {
        main: "#d144d1",
        light: "#df70df",
        dark: "#a632a6",
        contrastText: "#ffffff",
      },
      divider: "#fff",
      text: mode === "dark" ? darkText : lightText,
      error: {
        main: "#ef3b66",
        light: "#f36f8f",
        dark: "#c3264d",
        contrastText: "#ffffff",
      },
      warning: {
        main: "#f0cf4f",
        light: "#f4dd7b",
        dark: "#c3a53a",
        contrastText: "#2e2400",
      },
      info: {
        main: "#006eff",
        light: "#4d97ff",
        dark: "#0052bf",
        contrastText: "#ffffff",
      },
      success: {
        main: "#d7ff96",
        light: "#e6ffbb",
        dark: "#a6cc6b",
        contrastText: "#1f2a08",
      },
      background:
        mode === "dark"
          ? {
              paper: "#1a242b",
              default: "#111a22",
            }
          : {
              paper: "rgb(243, 247, 250)",
              default: "#eaf1f7",
            },
    },
  });

export const createThemeOptions2 = (mode = "light") =>
  createTheme({
    spacing: 3,
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
      fontFamily: "Roboto, sans-serif",
      fontSize: 14,
      button: {
        fontWeight: 500,
        fontSize: 12,
        fontFamily: "Roboto, sans-serif",
      },
      h6: {
        fontFamily: "Roboto, sans-serif",
        fontWeight: 500,
      },
      fontWeightLight: 100,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
      fontWeightBold: 900,
    },
  });

// Paleta "Hamlet Nordic Industrial"
// Una mezcla de grises azulados, verdes secos y un toque de ocre para destacar.

/* const lightBackground = {
  paper: "#ffffff",
  default: "#f8fafc", // Un gris azulado casi imperceptible que despega los componentes
};

const darkBackground = {
  paper: "#1e293b", // Slate 800: profundidad y elegancia
  default: "#0f172a", // Slate 900: el estándar de apps premium
}; */

export const createThemeOptions3 = (mode = "light") =>
  createTheme({
    spacing: 3,
    palette: {
      mode,
      // PRIMARIO: Verde Bosque / Teal Oscuro (Seriedad y confianza)
      primary: {
        main: "#0d9488", 
        light: "#2dd4bf",
        dark: "#115e59",
        contrastText: "#ffffff",
      },
      // SECUNDARIO: Slate Blue (Para las partes del trabajo, sofisticado)
      secondary: {
        main: "#64748b",
        light: "#94a3b8",
        dark: "#334155",
        contrastText: "#ffffff",
      },
      // ERROR: Rojo Coral (Avisos claros pero no agresivos)
      error: {
        main: "#e11d48",
        light: "#fb7185",
        dark: "#9f1239",
      },
      // WARNING: Ocre/Ambar (Personalidad pura para presupuestos pendientes)
      warning: {
        main: "#d97706",
        light: "#fbbf24",
        dark: "#92400e",
        contrastText: "#fff",
      },
      // INFO: Indigo Suave (Para el Validador de PDF)
      info: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4338ca",
        contrastText: "#fff",
      },
      // SUCCESS: Esmeralda Seco (Para las ganancias)
      success: {
        main: "#16a34a",
        light: "#4ade80",
        dark: "#166534",
        contrastText: "#fff",
      },
      background: mode === "dark" ? darkBackground : lightBackground,
      // Mejoramos la lectura del texto
      text: {
        primary: mode === "dark" ? "#f1f5f9" : "#1e293b",
        secondary: mode === "dark" ? "#94a3b8" : "#475569",
      }
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif", // 'Inter' es más moderna para interfaces densas
      fontSize: 14,
      button: {
        fontWeight: 600,
        textTransform: 'none', // Botones más naturales, no todo en mayúsculas
      },
    },
    // Un toque extra: bordes más suaves para un look moderno
    shape: {
      borderRadius: 8,
    },
  });  

/* const ThemeProv = (props) => {
  return <ThemeProvider theme={themeHamlet}>{props.children}</ThemeProvider>;
};
export default ThemeProv; */
// Paleta "Soft Industrial" - Enfoque en legibilidad y descanso visual

/* const lightBackground = {
  paper: "#ffffff",
  default: "#fdfbf7", // Un "Hueso" muy suave que elimina el brillo agresivo del blanco puro
};

const darkBackground = {
  paper: "#2d3436",
  default: "#1e272e",
}; */

export const createThemeOptions = (mode = "light") =>
  createTheme({
    spacing: 3,
    palette: {
      mode,
      // PRIMARIO: Petróleo Suave (Cercano a tu cian original pero más maduro)
      primary: {
        main: "#60a5fa", // Azul cielo pastel
        light: "#93c5fd",
        dark: "#2563eb",
        contrastText: "#ffffff",
      },
      // SECUNDARIO: Lavanda Grisáceo (Ideal para las "Partes" de trabajo)
      secondary: {
        main: "#a29bfe", 
        light: "#efebff",
        dark: "#6c5ce7",
        contrastText: "#fff",
      },
      // SUCCESS: Verde Menta (Para las ganancias y totales)
      success: {
        main: "#55efc4",
        light: "#81ecec",
        dark: "#00b894",
        contrastText: "#2d3436",
      },
      // WARNING: Durazno (Para presupuestos pendientes)
      warning: {
        main: "#fab1a0",
        light: "#ffeadb",
        dark: "#e17055",
        contrastText: "#2d3436",
      },
      error: {
        main: "#ff7675",
        light: "#fab1a0",
        dark: "#d63031",
      },
      background: mode === "dark" ? darkBackground : lightBackground,
      text: {
        primary: mode === "dark" ? "#f1f2f6" : "#2f3542", // Azul noche para el texto (más suave que el negro)
        secondary: "#747d8c",
      }
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      fontSize: 14,
      button: {
        fontWeight: 600,
        textTransform: 'none', // Da un look mucho más moderno y menos "gritado"
        borderRadius: 12,
      },
    },
    shape: {
      borderRadius: 12, // Bordes más redondeados para acompañar la suavidad de los colores
    },
  });
const ThemeProv = ({ mode, theme, children }) => {
  const resolvedTheme = React.useMemo(
    () => theme ?? createMxmTheme(mode),
    [theme, mode],
  );
  return <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>;
};

export default ThemeProv;
