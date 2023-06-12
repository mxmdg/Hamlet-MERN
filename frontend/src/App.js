import './App.css';
import './Styles/hamlet.css'
import Header from './Components/NavigationBar/Header'
import PrintersMainContainer from './Components/Printers/PrintersMainContainer';
import StocksMainContainer from './Components/Stocks/StocksMainContainer';
import FormatsMainContainer from './Components/Formats/FormatsMainContainer';
import MainContainer from './Components/General/MainContainer';
import Jobs from './Components/Jobs/Jobs'
import PricesMainContainer from './Components/Precioso/PricesMainContainer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/home'
import ConfigMainContainer from './Components/Config/ConfigMainContainer';
import Container from '@mui/material/Container'
import ThemeProv from './Components/Config/theme';


function App() {
  return (
    <ThemeProv>
      <BrowserRouter>    
        <Header />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hamlet/impresoras" element={<MainContainer entity={'impresoras'}/>} />
              <Route path="/hamlet/materiales" element={<MainContainer entity={'materiales'}/>} />
              <Route path="/hamlet/formatos" element={<MainContainer entity={'formatos'}/>} />
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
