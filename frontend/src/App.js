// App.js
import "./App.css";
import "./Styles/hamlet.css";
import Header from "./Components/NavigationBar/Header";
import { useMemo, useState } from "react";
import ThemeProv, { createAppTheme } from "./Components/Config/theme";
import AuthProvider from "./Components/context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import Spinner from "./Components/General/Spinner";
import ErrorMessage from "./Components/ErrorMessage/ErrorMessage";
import ErrorBoundary from "./Components/ErrorMessage/ErrorBoundary";
import cordoba from "./img/cordoba.webp";
import { useBackendStatus } from "./Hooks/useBackendStatus";
import {
  UserPreferencesProvider,
  useUserPreferences,
} from "./Hooks/useUserPreferences";
import { WindowManagerProvider, WindowCanvas, FloatingWindow } from "./Components/windowManager";
import QuickSpinCalc from "./Components/utils/spinCalculator/QuickSpinCalc";
import {ScaleCalculator} from "./Components/utils/spinCalculator/ScaleCalculator";
import NumberGenerator from "./Components/utils/generalData/NumberGenerator";
import ColorSheetRangeGenerator from "./Components/utils/generalData/ColorSheetRangeGenerator";

import LaunchIcon from '@mui/icons-material/Launch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import StraightenIcon from '@mui/icons-material/Straighten';

import { Container, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

// ---------------------------------------------------------------------------
// AppShell vive ADENTRO de <UserPreferencesProvider>, así puede leer "prefs"
// (mode + themeVariant) del context — es la ÚNICA fuente de verdad del theme.
// Ya no hay useState local de modo ni localStorage("appTheme") por separado:
// savePrefs() (desde acá, desde el Header, o desde Profile) actualiza esto
// mismo y se refleja al instante en todos lados, sin recargar la página.
// ---------------------------------------------------------------------------
function AppShell() {
  const [useLogin, setLogin] = useState(localStorage.getItem("login"));
  const { prefs } = useUserPreferences();

  const themeInUse = useMemo(
    () => createAppTheme(prefs.themeVariant, prefs.mode),
    [prefs.themeVariant, prefs.mode],
  );

  return (
    <ThemeProv theme={themeInUse} mode={prefs.mode}>
      {/*
        WindowManagerProvider va acá, adentro del ThemeProv (para heredar el
        tema de MUI en las paletas) y afuera de todo lo demás, así cualquier
        ruta/página puede abrir una ventana flotante con useWindowManager().
      */}
      <WindowManagerProvider>
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <ErrorBoundary
            fallback={
              <ErrorMessage
                title="Error inesperado"
                message="Ha ocurrido un error inesperado. Por favor, intente recargar la página."
              />
            }
          >
            <BrowserRouter>
              <AuthProvider>
                <Box
                  sx={{
                    width: "100%",
                    "@media print": { display: "none" },
                  }}
                >
                  {/*
                    Ya no le pasamos mode/toogleMode: AppBarResponsive lee
                    prefs y savePrefs directo de useUserPreferences(). Si tu
                    Header.jsx todavía reenvía esas props, ya no hacen falta
                    (podés sacarlas de ahí también, pero no rompen nada si
                    quedan sin usar).
                  */}
                  <Header />
                </Box>

                {/*
                  WindowCanvas reemplaza el Box de contenido que tenías.
                  Le pasamos exactamente el mismo sx que tenía antes (flex,
                  centrado, fondo), y por dentro sigue renderizando <Router />
                  normal. La diferencia es que ahora este Box es el área
                  donde flotan las ventanas: quedan clippeadas acá abajo,
                  sin poder taparte el Header de arriba.
                */}
                <WindowCanvas
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "stretch",
                    width: "100%",
                    background: localStorage.getItem("login")
                      ? themeInUse.palette.background.default
                      : `url(${cordoba})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPositionY: "30%",
                  }}
                >
                  {/* prefs ya nunca es null (el context arranca con
                      DEFAULT_PREFS), así que se lo pasamos directo, sin
                      el ternario de fallback que tenías antes. */}
                  <Router prefs={prefs} setLog={setLogin} />
                  <Grid>
                    <Grid size={{sm: 12, md:6}}>
                      <FloatingWindow id="calculadora" title="Calculadora de lomo" icon={<StraightenIcon />}>
                      <QuickSpinCalc color="primary" />
                  </FloatingWindow>

                    </Grid>
                    <Grid size={{sm: 12, md:6}}>
                      <FloatingWindow id="scale" title="Escalar Formato" icon={<LaunchIcon />}>
                      <ScaleCalculator color="primary" variant="outlined" />
                  </FloatingWindow>

                    </Grid>
                    <Grid size={{sm: 12, md:6}}>
                      <FloatingWindow id="numberGenerator" title="Generador de números" icon={<FormatListNumberedIcon />}>
                      <NumberGenerator color="primary" />
                  </FloatingWindow>

                    </Grid>
                    <Grid size={{sm: 12, md:6}}>
                      <FloatingWindow id="colorSheetRangeGenerator" title="Páginas color" icon={<MenuBookIcon />}>
                      <ColorSheetRangeGenerator color="primary" />
                      </FloatingWindow>
                    </Grid>
                  </Grid>
                </WindowCanvas>
              </AuthProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </Box>
      </WindowManagerProvider>
    </ThemeProv>
  );
}

function App() {
  const backendStatus = useBackendStatus();

  const checking = <Spinner title="Verificando estado del servidor..." />;

  const failure = (
    <ErrorMessage
      title="Servidor no disponible"
      message="No se puede conectar con el backend. Intente más tarde."
    />
  );

  if (backendStatus === "checking") return checking;
  if (backendStatus === "down") return failure;

  return (
    <UserPreferencesProvider>
      <AppShell />
    </UserPreferencesProvider>
  );
}

export default App;
