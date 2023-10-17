import './App.css';
import './Styles/hamlet.css'
import Header from './Components/NavigationBar/Header'
import PrintersMainContainer from './Components/Printers/PrintersMainContainer';
import PrintersDataForm from './Components/Formulario/PrintersDataForm';
import StocksMainContainer from './Components/Stocks/StocksMainContainer';
import StockDataForm from './Components/Formulario/StockDataForm'
import FormatsMainContainer from './Components/Formats/FormatsMainContainer';
import FormatDataForm from './Components/Formulario/FormatDataForm';
import jobPartDataForm from './Components/Formulario/JobPartsDataForm';
import PricesDataForm from './Components/Formulario/PricesDataForm';
import UsersDataForm from './Components/Formulario/UsersDataForm';
import MainContainer from './Components/General/MainContainer';
import { Register } from './Components/Users/Register';
import { Login } from './Components/Users/Login';
import JobsForm from './Components/Jobs/JobsForm';
import { JobViewer } from './Components/jobViewer/JobViewer';
import MyStepper from './Components/Jobs/Stepper';
import JobsContainer from './Components/Jobs/JobsContainer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/home'
import ConfigMainContainer from './Components/Config/ConfigMainContainer';
import Form from './Components/Formulario/Form';
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import ThemeProv from "./Components/Config/theme";
import { themeMxm } from './Components/Config/theme';
import AuthProvider from './Components/context/AuthContext';
import { AuthContext } from './Components/context/AuthContext';
import { Container } from '@mui/material';


function App() {
  const [themeMode, setThemeMode] = useState("light"); // Estado para el modo de tema

  return (
    <ThemeProv>
      <BrowserRouter> 
        <AuthProvider>
          <Box>
            <Header />
          </Box>
          <Box sx={{ 
              display: "flex", 
              width: "100vw",
              minHeight: "90vh",
              alignItems: "center",
              justifyContent: "center"
              }}>
              <Routes>
                <Route path="/" element={<Home />} />                
                <Route path="/login" element={<Login />} />
                <Route path="/impresoras" element={<MainContainer entity={'impresoras'}/>} />
                <Route path="/impresoras/add" element={<Form form={PrintersDataForm} collection='impresoras' task="new"/>} />
                <Route path="/impresoras/copy/:id" element={<Form form={PrintersDataForm} collection='impresoras' task="copy"/>} />
                <Route path="/impresoras/edit/:id" element={<Form form={PrintersDataForm} collection='impresoras' task="edit"/>} />
                <Route path="/materiales" element={<MainContainer entity={'materiales'}/>} />
                <Route path="/materiales/add" element={<Form form={StockDataForm} collection='materiales' task="new"/>} />
                <Route path="/materiales/copy/:id" element={<Form form={StockDataForm} collection='materiales' task="copy"/>} />
                <Route path="/materiales/edit/:id" element={<Form form={StockDataForm} collection='materiales' task="edit"/>} />
                <Route path="/formatos" element={<MainContainer entity={'formatos'}/>} />
                <Route path="/formatos/add" element={<Form form={FormatDataForm} collection='formatos' task="new"/>} />
                <Route path="/formatos/copy/:id" element={<Form form={FormatDataForm} collection='formatos' task="copy"/>} />
                <Route path="/formatos/edit/:id" element={<Form form={FormatDataForm} collection='formatos' task="edit"/>} />
                <Route path="/JobParts" element={<MainContainer entity={'JobParts'}/>} />
                <Route path="/JobParts/add" element={<Form form={jobPartDataForm} collection='JobParts' task="new"/>} />
                <Route path="/JobParts/copy/:id" element={<Form form={jobPartDataForm} collection='JobParts' task="copy"/>} />
                <Route path="/JobParts/edit/:id" element={<Form form={jobPartDataForm} collection='JobParts' task="edit"/>} />
                <Route path="/users" element={<MainContainer entity={'users'}/>} />
                <Route path="/users/add" element={<Register/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/users/edit/:id" element={<Form form={UsersDataForm} collection='users' task="edit"/>} />
                <Route path="/Jobs" element={<JobsContainer entity={'Jobs'} />} />
                <Route path="/Jobs/add" element={<MyStepper />} />
                <Route path="/Jobs/edit/:id" element={<JobViewer entity={'Jobs'} />} />
                <Route path="/precios" element={<MainContainer entity={'precios'}/>} />
                <Route path="/precios/edit/:id" element={<Form form={PricesDataForm} collection='precios' task="edit"/>} />
                <Route path="/precios/add" element={<Form form={PricesDataForm} collection='precios' task="new"/>} />
                <Route path="/configuracion" element={<ConfigMainContainer />} />
                <Route path="/configuracion/formatos" element={<FormatsMainContainer />} />
                <Route path="/configuracion/materiales" element={<StocksMainContainer />} />
                <Route path="/configuracion/impresoras" element={<PrintersMainContainer />} />
              </Routes>
            </Box>
            </AuthProvider>
        </BrowserRouter>
      </ThemeProv>
  )
}

export default App;
