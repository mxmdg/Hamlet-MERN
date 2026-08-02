import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// ---------------------------------------------------------------------------
// Tokens de texto por default. Cualquier variante puede pisarlos definiendo
// su propio `text` en light/dark (como hacen "nordic" y "softIndustrial").
// ---------------------------------------------------------------------------
const defaultText = {
  light: { primary: "#000", secondary: "#000", disabled: "#aaa", hint: "#067" },
  dark: { primary: "#eee", secondary: "#3ef", disabled: "#888", hint: "#0ab" },
};

// Fondo compartido por "mxm" y por las variantes que en el original nunca
// definieron uno propio (vivid, nordic, softIndustrial) — lo hago explícito
// acá en vez de dejarlo como una coincidencia silenciosa.
const mxmBackground = {
  light: { paper: "#edf6e3ff", default: "linear-gradient(45deg, #D9AFD9 0%, #97D9E1 100%)" },
  dark: { paper: "#06222d", default: "linear-gradient(135deg, #06222d 0%, #1f003b 100%)" },
};

// ---------------------------------------------------------------------------
// UNA sola fuente de verdad por paleta. Cada variante es autocontenida:
// su propio light Y su propio dark, background incluido. Nada se comparte
// "por accidente" entre variantes — si dos paletas se parecen es porque
// vos las hiciste parecidas, no porque compartan una referencia.
//
// Para agregar una paleta nueva: copiás un bloque, le cambiás los colores.
// No hay riesgo de choque de nombres (`const lightBackground` duplicado)
// porque no hay consts sueltas — todo vive adentro de este objeto.
// ---------------------------------------------------------------------------
const VARIANTS = {
  // Era: createMxmTheme
  mxm: {
    spacing: 4,
    light: {
      primary: { main: "#09b4bd", light: "#00e3e3", dark: "#1c8a90", contrastText: "#ffffff" },
      secondary: { main: "#bd00b4", light: "#e42d5d", dark: "#900032", contrastText: "#ffffff" },
      error: { main: "#e31436", light: "#e32f59", dark: "#99122a", contrastText: "#ffffff" },
      warning: { main: "#ff9727", light: "#ffa44b", dark: "#a5611a", contrastText: "#291a05" },
      info: { main: "#3eceee", light: "#46aefa", dark: "#17648e", contrastText: "#092a3b" },
      success: { main: "#95d420e3", light: "#d0f19aff", dark: "#79910fff", contrastText: "#fff" },
      background: mxmBackground.light,
      text: defaultText.light,
    },
    dark: {
      primary: { main: "#09b4bd", light: "#00e3e3", dark: "#1c8a90", contrastText: "#ffffff" },
      secondary: { main: "#bd00b4", light: "#e42d5d", dark: "#900032", contrastText: "#ffffff" },
      error: { main: "#e31436", light: "#e32f59", dark: "#99122a", contrastText: "#ffffff" },
      warning: { main: "#ff9727", light: "#ffa44b", dark: "#a5611a", contrastText: "#291a05" },
      info: { main: "#3eceee", light: "#46aefa", dark: "#17648e", contrastText: "#092a3b" },
      success: { main: "#95d420e3", light: "#d0f19aff", dark: "#79910fff", contrastText: "#fff" },
      background: mxmBackground.dark,
      text: defaultText.dark,
    },
  },

  // Era: createMintPulseTheme
  mintPulse: {
    spacing: 4,
    light: {
      primary: { main: "#8ff5d8", light: "#b2f9e6", dark: "#64cdb1", contrastText: "#052018" },
      secondary: { main: "#d144d1", light: "#df70df", dark: "#a632a6", contrastText: "#ffffff" },
      error: { main: "#ef3b66", light: "#f36f8f", dark: "#c3264d", contrastText: "#ffffff" },
      warning: { main: "#f0cf4f", light: "#f4dd7b", dark: "#c3a53a", contrastText: "#2e2400" },
      info: { main: "#006eff", light: "#4d97ff", dark: "#0052bf", contrastText: "#ffffff" },
      success: { main: "#d7ff96", light: "#e6ffbb", dark: "#a6cc6b", contrastText: "#1f2a08" },
      background: { paper: "rgb(243, 247, 250)", default: "#eaf1f7" },
      text: defaultText.light,
    },
    dark: {
      primary: { main: "#8ff5d8", light: "#b2f9e6", dark: "#64cdb1", contrastText: "#052018" },
      secondary: { main: "#d144d1", light: "#df70df", dark: "#a632a6", contrastText: "#ffffff" },
      error: { main: "#ef3b66", light: "#f36f8f", dark: "#c3264d", contrastText: "#ffffff" },
      warning: { main: "#f0cf4f", light: "#f4dd7b", dark: "#c3a53a", contrastText: "#2e2400" },
      info: { main: "#006eff", light: "#4d97ff", dark: "#0052bf", contrastText: "#ffffff" },
      success: { main: "#d7ff96", light: "#e6ffbb", dark: "#a6cc6b", contrastText: "#1f2a08" },
      background: { paper: "#1a242b", default: "#111a22" },
      text: defaultText.dark,
    },
  },

  // Era: createThemeOptions2 (sin nombre propio en tus comentarios)
  vivid: {
    spacing: 3,
    typography: {
      fontFamily: "Roboto, sans-serif",
      fontSize: 14,
      button: { fontWeight: 500, fontSize: 12, fontFamily: "Roboto, sans-serif" },
      h6: { fontFamily: "Roboto, sans-serif", fontWeight: 500 },
      fontWeightLight: 100,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
      fontWeightBold: 900,
    },
    // Esta variante nunca tuvo background propio en el original: comparte
    // el fondo de "mxm" a propósito (lo dejo explícito, no por accidente).
    light: {
      primary: { main: "#26c2a3", light: "#62f6ca", dark: "#109888", contrastText: "#000000" },
      secondary: { main: "#7a66f4", light: "#9881f2", dark: "#303d8a", contrastText: "#f3e5f5" },
      error: { main: "#ed2456", light: "#ff788a", dark: "#940c45" },
      warning: { main: "#f7c631", light: "#fce26a", dark: "#cf8d1b", contrastText: "rgba(2,2,1)" },
      info: { main: "#009fd9", light: "#4dc3ea", dark: "#0b548c", contrastText: "#fff" },
      success: { main: "#b0ff1eff", light: "#d0f19aff", dark: "#a0c209ff", contrastText: "#fff" },
      background: mxmBackground.light,
      text: defaultText.light,
    },
    dark: {
      primary: { main: "#26c2a3", light: "#62f6ca", dark: "#109888", contrastText: "#000000" },
      secondary: { main: "#7a66f4", light: "#9881f2", dark: "#303d8a", contrastText: "#f3e5f5" },
      error: { main: "#ed2456", light: "#ff788a", dark: "#940c45" },
      warning: { main: "#f7c631", light: "#fce26a", dark: "#cf8d1b", contrastText: "rgba(2,2,1)" },
      info: { main: "#009fd9", light: "#4dc3ea", dark: "#0b548c", contrastText: "#fff" },
      success: { main: "#b0ff1eff", light: "#d0f19aff", dark: "#a0c209ff", contrastText: "#fff" },
      background: mxmBackground.dark,
      text: defaultText.dark,
    },
  },

  // Era: createThemeOptions3 ("Hamlet Nordic Industrial")
  nordic: {
    spacing: 3,
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      fontSize: 14,
      button: { fontWeight: 600, textTransform: "none" },
    },
    light: {
      primary: { main: "#0d9488", light: "#2dd4bf", dark: "#115e59", contrastText: "#ffffff" },
      secondary: { main: "#64748b", light: "#94a3b8", dark: "#334155", contrastText: "#ffffff" },
      error: { main: "#e11d48", light: "#fb7185", dark: "#9f1239" },
      warning: { main: "#d97706", light: "#fbbf24", dark: "#92400e", contrastText: "#fff" },
      info: { main: "#6366f1", light: "#818cf8", dark: "#4338ca", contrastText: "#fff" },
      success: { main: "#16a34a", light: "#4ade80", dark: "#166534", contrastText: "#fff" },
      background: mxmBackground.light, // idem: comparte el fondo de "mxm" en el original
      text: { primary: "#1e293b", secondary: "#475569" },
    },
    dark: {
      primary: { main: "#0d9488", light: "#2dd4bf", dark: "#115e59", contrastText: "#ffffff" },
      secondary: { main: "#64748b", light: "#94a3b8", dark: "#334155", contrastText: "#ffffff" },
      error: { main: "#e11d48", light: "#fb7185", dark: "#9f1239" },
      warning: { main: "#d97706", light: "#fbbf24", dark: "#92400e", contrastText: "#fff" },
      info: { main: "#6366f1", light: "#818cf8", dark: "#4338ca", contrastText: "#fff" },
      success: { main: "#16a34a", light: "#4ade80", dark: "#166534", contrastText: "#fff" },
      background: mxmBackground.dark,
      text: { primary: "#f1f5f9", secondary: "#94a3b8" },
    },
  },

  // Era: createThemeOptions ("Soft Industrial" — la que quedó activa/comentada en App.js)
  softIndustrial: {
    spacing: 3,
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      fontSize: 14,
      button: { fontWeight: 600, textTransform: "none", borderRadius: 12 },
    },
    light: {
      primary: { main: "#60a5fa", light: "#93c5fd", dark: "#2563eb", contrastText: "#ffffff" },
      secondary: { main: "#a29bfe", light: "#efebff", dark: "#6c5ce7", contrastText: "#fff" },
      success: { main: "#55efc4", light: "#81ecec", dark: "#00b894", contrastText: "#2d3436" },
      warning: { main: "#fab1a0", light: "#ffeadb", dark: "#e17055", contrastText: "#2d3436" },
      error: { main: "#ff7675", light: "#fab1a0", dark: "#d63031" },
      background: mxmBackground.light,
      text: { primary: "#2f3542", secondary: "#747d8c" },
    },
    dark: {
      primary: { main: "#60a5fa", light: "#93c5fd", dark: "#2563eb", contrastText: "#ffffff" },
      secondary: { main: "#a29bfe", light: "#efebff", dark: "#6c5ce7", contrastText: "#fff" },
      success: { main: "#55efc4", light: "#81ecec", dark: "#00b894", contrastText: "#2d3436" },
      warning: { main: "#fab1a0", light: "#ffeadb", dark: "#e17055", contrastText: "#2d3436" },
      error: { main: "#ff7675", light: "#fab1a0", dark: "#d63031" },
      background: mxmBackground.dark,
      text: { primary: "#f1f2f6", secondary: "#747d8c" },
    },
  },
};

// ---------------------------------------------------------------------------
// Factory ÚNICA. Reemplaza a las 5 funciones createX() de antes.
// mode-aware: `divider` y `mode` los pone acá, no en cada variante.
// ---------------------------------------------------------------------------
export function createAppTheme(variantName = "mxm", mode = "light") {
  const variant = VARIANTS[variantName] || VARIANTS.mxm;
  const tokens = variant[mode] || variant.light;

  return createTheme({
    spacing: variant.spacing ?? 4,
    shape: variant.shape,
    typography: variant.typography,
    palette: {
      mode,
      divider: mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
      ...tokens,
    },
  });
}

export const THEME_VARIANTS = Object.keys(VARIANTS);

// Metadata liviana para armar un selector de paleta en la UI (nombre +
// colores de muestra), sin tener que instanciar el theme completo solo
// para mostrar un par de círculos de color.
export const VARIANT_INFO = {
  mxm: { label: "Revelación", swatch: ["#09b4bd", "#bd00b4"] },
  mintPulse: { label: "Fervor", swatch: ["#8ff5d8", "#d144d1"] },
  vivid: { label: "Bravura", swatch: ["#26c2a3", "#7a66f4"] },
  nordic: { label: "Eternidad", swatch: ["#0d9488", "#64748b"] },
  softIndustrial: { label: "Serenidad", swatch: ["#60a5fa", "#a29bfe"] },
};

// ---------------------------------------------------------------------------
// Compat: mismos nombres de antes, así App.js (y cualquier otro archivo que
// los importe) sigue funcionando sin tocar nada. Internamente ya no hay
// funciones separadas, todas delegan en createAppTheme().
// ---------------------------------------------------------------------------
export const createMxmTheme = (mode = "light") => createAppTheme("mxm", mode);
export const createMintPulseTheme = (mode = "light") => createAppTheme("mintPulse", mode);
export const createThemeOptions2 = (mode = "light") => createAppTheme("vivid", mode);
export const createThemeOptions3 = (mode = "light") => createAppTheme("nordic", mode);
export const createThemeOptions = (mode = "light") => createAppTheme("softIndustrial", mode);

const ThemeProv = ({ mode, theme, children }) => {
  const resolvedTheme = React.useMemo(
    () => theme ?? createAppTheme("mxm", mode),
    [theme, mode],
  );
  return <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>;
};

export default ThemeProv;
