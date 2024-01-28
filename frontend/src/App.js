import "./App.css";
import "./Styles/hamlet.css";
import Header from "./Components/NavigationBar/Header";
import PrintersMainContainer from "./Components/Printers/PrintersMainContainer";
import PrintersDataForm from "./Components/Formulario/PrintersDataForm";
import StocksMainContainer from "./Components/Stocks/StocksMainContainer";
import StockDataForm from "./Components/Formulario/StockDataForm";
import FormatsMainContainer from "./Components/Formats/FormatsMainContainer";
import FormatDataForm from "./Components/Formulario/FormatDataForm";
import empresasDataForm from "./Components/Formulario/empresasDataForm";
import jobPartDataForm from "./Components/Formulario/JobPartsDataForm";
import PricesDataForm from "./Components/Formulario/PricesDataForm";
import UsersDataForm from "./Components/Formulario/UsersDataForm";
import MainContainer from "./Components/General/MainContainer";
import { Register } from "./Components/Users/Register";
import { Login } from "./Components/Users/Login";
import { JobViewer } from "./Components/jobViewer/JobViewer";
import MyStepper from "./Components/Jobs/Stepper";
import JobsContainer from "./Components/Jobs/JobsContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/home";
import ConfigMainContainer from "./Components/Config/ConfigMainContainer";
import Form from "./Components/Formulario/Form";
import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import ThemeProv from "./Components/Config/theme";
import AuthProvider from "./Components/context/AuthContext";
import { AuthContext } from "./Components/context/AuthContext";
import { Container } from "@mui/material";
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
            <Box>
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
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/impresoras"
                  element={<MainContainer entity={"impresoras"} />}
                />
                <Route
                  path="/impresoras/add"
                  element={
                    <Form
                      form={PrintersDataForm}
                      collection="impresoras"
                      task="new"
                    />
                  }
                />
                <Route
                  path="/impresoras/copy/:id"
                  element={
                    <Form
                      form={PrintersDataForm}
                      collection="impresoras"
                      task="copy"
                    />
                  }
                />
                <Route
                  path="/impresoras/edit/:id"
                  element={
                    <Form
                      form={PrintersDataForm}
                      collection="impresoras"
                      task="edit"
                    />
                  }
                />
                <Route
                  path="/materiales"
                  element={<MainContainer entity={"materiales"} />}
                />
                <Route
                  path="/materiales/add"
                  element={
                    <Form
                      form={StockDataForm}
                      collection="materiales"
                      task="new"
                    />
                  }
                />
                <Route
                  path="/materiales/copy/:id"
                  element={
                    <Form
                      form={StockDataForm}
                      collection="materiales"
                      task="copy"
                    />
                  }
                />
                <Route
                  path="/materiales/edit/:id"
                  element={
                    <Form
                      form={StockDataForm}
                      collection="materiales"
                      task="edit"
                    />
                  }
                />
                <Route
                  path="/formatos"
                  element={<MainContainer entity={"formatos"} />}
                />
                <Route
                  path="/formatos/add"
                  element={
                    <Form
                      form={FormatDataForm}
                      collection="formatos"
                      task="new"
                    />
                  }
                />
                <Route
                  path="/formatos/copy/:id"
                  element={
                    <Form
                      form={FormatDataForm}
                      collection="formatos"
                      task="copy"
                    />
                  }
                />
                <Route
                  path="/formatos/edit/:id"
                  element={
                    <Form
                      form={FormatDataForm}
                      collection="formatos"
                      task="edit"
                    />
                  }
                />
                <Route
                  path="/empresas"
                  element={<MainContainer entity={"empresas"} />}
                />
                <Route
                  path="/empresas/add"
                  element={
                    <Form
                      form={empresasDataForm}
                      collection="empresas"
                      task="new"
                    />
                  }
                />
                <Route
                  path="/empresas/copy/:id"
                  element={
                    <Form
                      form={empresasDataForm}
                      collection="empresas"
                      task="copy"
                    />
                  }
                />
                <Route
                  path="/empresas/edit/:id"
                  element={
                    <Form
                      form={empresasDataForm}
                      collection="empresas"
                      task="edit"
                    />
                  }
                />
                <Route
                  path="/JobParts"
                  element={<MainContainer entity={"JobParts"} />}
                />
                <Route
                  path="/JobParts/add"
                  element={
                    <Form
                      form={jobPartDataForm}
                      collection="JobParts"
                      task="new"
                    />
                  }
                />
                <Route
                  path="/JobParts/copy/:id"
                  element={
                    <Form
                      form={jobPartDataForm}
                      collection="JobParts"
                      task="copy"
                    />
                  }
                />
                <Route
                  path="/JobParts/edit/:id"
                  element={
                    <Form
                      form={jobPartDataForm}
                      collection="JobParts"
                      task="edit"
                    />
                  }
                />
                <Route
                  path="/users"
                  element={<MainContainer entity={"users"} />}
                />
                <Route path="/users/add" element={<Register />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/users/edit/:id"
                  element={
                    <Form form={UsersDataForm} collection="users" task="edit" />
                  }
                />
                <Route
                  path="/Jobs"
                  element={<JobsContainer entity={"Jobs"} />}
                />
                <Route path="/Jobs/add" element={<MyStepper />} />
                <Route
                  path="/Jobs/edit/:id"
                  element={<JobViewer entity={"Jobs"} />}
                />
                <Route
                  path="/precios"
                  element={<MainContainer entity={"precios"} />}
                />
                <Route
                  path="/precios/edit/:id"
                  element={
                    <Form
                      form={PricesDataForm}
                      collection="precios"
                      task="edit"
                    />
                  }
                />
                <Route
                  path="/precios/add"
                  element={
                    <Form
                      form={PricesDataForm}
                      collection="precios"
                      task="new"
                    />
                  }
                />
                <Route
                  path="/configuracion"
                  element={<ConfigMainContainer />}
                />
                <Route
                  path="/configuracion/formatos"
                  element={<FormatsMainContainer />}
                />
                <Route
                  path="/configuracion/materiales"
                  element={<StocksMainContainer />}
                />
                <Route
                  path="/configuracion/impresoras"
                  element={<PrintersMainContainer />}
                />
              </Routes>
            </Box>
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProv>
  );
}

export default App;
