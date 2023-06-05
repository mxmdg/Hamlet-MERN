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


function App() {
  return (
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
          <Route path="/hamlet/configuracion" element={<PricesMainContainer />} />
        </Routes>  
      </Container>
      </BrowserRouter>
  )
}

export default App;
