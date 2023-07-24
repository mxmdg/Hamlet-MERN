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
import MainContainer from './Components/General/MainContainer';
import JobsForm from './Components/Jobs/JobsForm'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/home'
import ConfigMainContainer from './Components/Config/ConfigMainContainer';
import Container from '@mui/material/Container'
import Form from './Components/Formulario/Form';
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import ThemeProv from "./Components/Config/theme";
import { themeMxm } from './Components/Config/theme';


function App() {
  const [themeMode, setThemeMode] = useState("light"); // Estado para el modo de tema

  return (
    <ThemeProv>
      <BrowserRouter>    
        <Header />
          <Box sx={{ 
            display: "flex", 
            width: "100vw",
            minHeight: "90vh",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid red"
            }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hamlet/impresoras" element={<MainContainer entity={'impresoras'}/>} />
              <Route path="/hamlet/impresoras/add" element={<Form form={PrintersDataForm} collection='impresoras' task="new"/>} />
              <Route path="/hamlet/impresoras/copy/:id" element={<Form form={PrintersDataForm} collection='impresoras' task="copy"/>} />
              <Route path="/hamlet/impresoras/edit/:id" element={<Form form={PrintersDataForm} collection='impresoras' task="edit"/>} />
              <Route path="/hamlet/materiales" element={<MainContainer entity={'materiales'}/>} />
              <Route path="/hamlet/materiales/add" element={<Form form={StockDataForm} collection='materiales' task="new"/>} />
              <Route path="/hamlet/materiales/copy/:id" element={<Form form={StockDataForm} collection='materiales' task="copy"/>} />
              <Route path="/hamlet/materiales/edit/:id" element={<Form form={StockDataForm} collection='materiales' task="edit"/>} />
              <Route path="/hamlet/formatos" element={<MainContainer entity={'formatos'}/>} />
              <Route path="/hamlet/formatos/add" element={<Form form={FormatDataForm} collection='formatos' task="new"/>} />
              <Route path="/hamlet/formatos/copy/:id" element={<Form form={FormatDataForm} collection='formatos' task="copy"/>} />
              <Route path="/hamlet/formatos/edit/:id" element={<Form form={FormatDataForm} collection='formatos' task="edit"/>} />
              <Route path="/hamlet/JobParts" element={<MainContainer entity={'JobParts'}/>} />
              <Route path="/hamlet/JobParts/add" element={<Form form={jobPartDataForm} collection='JobParts' task="new"/>} />
              <Route path="/hamlet/JobParts/copy/:id" element={<Form form={jobPartDataForm} collection='JobParts' task="copy"/>} />
              <Route path="/hamlet/JobParts/edit/:id" element={<Form form={jobPartDataForm} collection='JobParts' task="edit"/>} />
              <Route path="/hamlet/trabajos" element={<JobsForm />} />
              <Route path="/hamlet/precios" element={<MainContainer entity={'precios'}/>} />
              <Route path="/hamlet/configuracion" element={<ConfigMainContainer />} />
              <Route path="/hamlet/configuracion/formatos" element={<FormatsMainContainer />} />
              <Route path="/hamlet/configuracion/materiales" element={<StocksMainContainer />} />
              <Route path="/hamlet/configuracion/impresoras" element={<PrintersMainContainer />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProv>
  )
}

export default App;
