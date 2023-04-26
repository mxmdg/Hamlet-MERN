import './App.css';
import './Styles/hamlet.css'
import Header from './Components/NavigationBar/Header'
import PrintersMainContainer from './Components/Printers/PrintersMainContainer';
import StocksMainContainer from './Components/Stocks/StocksMainContainer';
import FormatsMainContainer from './Components/Formats/FormatsMainContainer';
import Jobs from './Components/Jobs/Jobs'
import PricesMainContainer from './Components/Precioso/PricesMainContainer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/home'
import ConfigMainContainer from './Components/Config/ConfigMainContainer';


function App() {
  return (
    <BrowserRouter>    
      <Header />
        <div className='mainContainer'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hamlet/impresoras" element={<PrintersMainContainer />} />
            <Route path="/hamlet/materiales" element={<StocksMainContainer />} />
            <Route path="/hamlet/formatos" element={<FormatsMainContainer />} />
            <Route path="/hamlet/jobs" element={<Jobs />} />
            <Route path="/hamlet/precios" element={<PricesMainContainer />} />
            <Route path="/hamlet/configuracion" element={<ConfigMainContainer />} />
          </Routes>  
        </div>
      </BrowserRouter>
  )
}

export default App;
