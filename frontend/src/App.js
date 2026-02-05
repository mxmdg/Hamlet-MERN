// App.js
import "./App.css";
import "./Styles/hamlet.css";
import Header from "./Components/NavigationBar/Header";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import ThemeProv from "./Components/Config/theme";
import AuthProvider from "./Components/context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
//import { themeOptions } from "./Components/Config/theme";
import { createMxmTheme } from "./Components/Config/theme";
/*import {
  themeIndependiente,
  themeBocaJuniors,
} from "./Components/Config/TemasAFA";
*/
import Spinner from "./Components/General/Spinner";
import ErrorMessage from "./Components/ErrorMessage/ErrorMessage";
import ErrorBoundary from "./Components/ErrorMessage/ErrorBoundary";
import cordoba from "./img/cordoba.webp";
import rio from "./img/rio.jpg";
import roble from "./img/roble.jpg";
import pinar from "./img/pinar.jpg";
import Mateo from "./img/Mateo.jpeg";
import sky from "./img/Sky.jpg";
import myIMG_0626 from "./img/IMG_0626.jpeg";
import paperBackground from "./img/paperBackground.jpg";
import { useBackendStatus } from "./Hooks/useBackendStatus";
import { useUserPreferences } from "./Hooks/useUserPreferences";

function App() {
  // Verificar si el tema está almacenado en localStorage
  const storedTheme = localStorage.getItem("appTheme");
  const initialMode = storedTheme ? storedTheme : "light"; // Valor por defecto si no hay nada en localStorage
  const [useMode, setMode] = useState(initialMode);
  const [useLogin, setLogin] = useState(localStorage.getItem("login"));

  const backendStatus = useBackendStatus();
  const { prefs, savePrefs } = useUserPreferences();

  useEffect(() => {}, [backendStatus, prefs]);

  const checking = <Spinner title="Verificando estado del servidor..." />;

  const failure = (
    <ErrorMessage
      title="Servidor no disponible"
      message="No se puede conectar con el backend. Intente más tarde."
    />
  );

  const toogleMode = () => {
    const stored = localStorage.getItem("userSettings");
    const currentSettings = stored ? JSON.parse(stored) : {};
    const nextMode = useMode === "light" ? "dark" : "light";

    const nextSettings = {
      ...currentSettings,
      mode: nextMode,
    };

    setMode(nextMode);
    localStorage.setItem("userSettings", JSON.stringify(nextSettings));
    localStorage.setItem("appTheme", nextMode);
  };

  const themeInUse = useMemo(() => createMxmTheme(useMode), [useMode]);
  //const themeInUse = createThemeOptions(useMode);

  const success = (
    <ThemeProv theme={themeInUse} mode={useMode}>
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
                <Header toogleMode={toogleMode} mode={useMode} />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
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
                <Router
                  prefs={
                    prefs !== null
                      ? prefs
                      : { color: "info", variant: "outlined" }
                  }
                  setLog={setLogin}
                />
              </Box>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </Box>
    </ThemeProv>
  );

  return backendStatus === "checking"
    ? checking
    : backendStatus === "down"
      ? failure
      : success;
}

export default App;
