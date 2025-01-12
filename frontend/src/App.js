// App.js
import "./App.css";
import "./Styles/hamlet.css";
import Header from "./Components/NavigationBar/Header";
import React, { useState } from "react";
import { Box } from "@mui/material";
import ThemeProv from "./Components/Config/theme";
import AuthProvider from "./Components/context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { themeOptions } from "./Components/Config/theme";

function App() {
  const [useMode, setMode] = useState("dark");

  const toogleMode = () => {
    console.log(useMode);
    useMode ? setMode(false) : setMode(true);
  };

  return (
    <ThemeProv mode={useMode}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          maxHeight: "100%",
          background: themeOptions.palette.background.default,
        }}
      >
        <BrowserRouter>
          <AuthProvider>
            <Box sx={{ "@media print": { display: "none" } }}>
              <Header toogleMode={toogleMode} />
            </Box>
            <Box
              sx={{
                marginTop: "7vh",
                display: "flex",
                width: "100vw",
                minHeight: "90vh",
                alignItems: "center",
                justifyContent: "center",
                background: themeOptions.palette.background.default,
              }}
            >
              <Router />
            </Box>
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProv>
  );
}

export default App;
