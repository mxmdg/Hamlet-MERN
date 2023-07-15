import './App.css';
import './Styles/hamlet.css'
import Header from './Components/NavigationBar/Header'
import PrintersMainContainer from './Components/Printers/PrintersMainContainer';
import PrintersDataForm from './Components/Formulario/PrintersDataForm';
import StocksMainContainer from './Components/Stocks/StocksMainContainer';
import StockDataForm from './Components/Formulario/StockDataForm'
import FormatsMainContainer from './Components/Formats/FormatsMainContainer';
import FormatDataForm from './Components/Formulario/FormatDataForm'
import MainContainer from './Components/General/MainContainer';
import Jobs from './Components/Jobs/Jobs'
import PricesMainContainer from './Components/Precioso/PricesMainContainer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/home'
import ConfigMainContainer from './Components/Config/ConfigMainContainer';
import Container from '@mui/material/Container'
import ThemeProv from './Components/Config/theme';
import Form from './Components/Formulario/Form';


function App() {
  return (
    <ThemeProv>
      <BrowserRouter>    
        <Header />
          <Container>
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
              <Route path="/hamlet/trabajos" element={<Jobs />} />
              <Route path="/hamlet/precios" element={<MainContainer entity={'precios'}/>} />
              <Route path="/hamlet/configuracion" element={<ConfigMainContainer />} />
              <Route path="/hamlet/configuracion/formatos" element={<FormatsMainContainer />} />
              <Route path="/hamlet/configuracion/materiales" element={<StocksMainContainer />} />
              <Route path="/hamlet/configuracion/impresoras" element={<PrintersMainContainer />} />
            </Routes>  
          </Container>
        </BrowserRouter>
      </ThemeProv>
  )
}

export default App;
