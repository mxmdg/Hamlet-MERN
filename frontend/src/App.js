// App.js
import "./App.css";
import "./Styles/hamlet.css";
import Header from "./Components/NavigationBar/Header";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ThemeProv from "./Components/Config/theme";
import AuthProvider from "./Components/context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { themeOptions } from "./Components/Config/theme";
import { themeMxm } from "./Components/Config/theme";
import {
  themeIndependiente,
  themeBocaJuniors,
} from "./Components/Config/TemasAFA";

import Spinner from "./Components/General/Spinner";
import ErrorMessage from "./Components/ErrorMessage/ErrorMessage";

import { useBackendStatus } from "./Hooks/useBackendStatus";

function App() {
  // Verificar si el tema está almacenado en localStorage
  const storedTheme = localStorage.getItem("appTheme");
  const initialMode = storedTheme ? storedTheme : "light"; // Valor por defecto si no hay nada en localStorage
  const [useMode, setMode] = useState(initialMode);

  const backendStatus = useBackendStatus();

  useEffect(() => {}, [backendStatus]);

  const checking = <Spinner title="Verificando estado del servidor..." />;

  const failure = (
    <ErrorMessage
      title="Servidor no disponible"
      message="No se puede conectar con el backend. Intente más tarde."
    />
  );

  const toogleMode = () => {
    if (useMode === "light") {
      setMode("dark");
      localStorage.setItem("appTheme", "dark");
    } else {
      setMode("light");
      localStorage.setItem("appTheme", "light");
    }
  };

  const themeInUse = themeMxm;
  //const themeInUse = themeOptions;

  const success = (
    <ThemeProv theme={themeInUse} mode={useMode}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          maxHeight: "100%",
          background: themeInUse.palette.background.default,
        }}
      >
        <BrowserRouter>
          <AuthProvider>
            <Box sx={{ "@media print": { display: "none" } }}>
              <Header toogleMode={toogleMode} mode={useMode} />
            </Box>
            <Box
              sx={{
                marginTop: "7vh",
                display: "flex",
                width: "100vw",
                minHeight: "90vh",
                alignItems: "center",
                justifyContent: "center",
                background: themeInUse.palette.background.default,
              }}
            >
              <Router />
            </Box>
          </AuthProvider>
        </BrowserRouter>
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
