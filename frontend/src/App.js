import './App.css';
import './Styles/hamlet.css'
import Header from './Components/NavigationBar/Header'
import PrintersMainContainer from './Components/Printers/PrintersMainContainer';
import StocksMainContainer from './Components/Stocks/StocksMainContainer';
import Jobs from './Components/Jobs/Jobs'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/home'


function App() {
  return (
    <BrowserRouter>    
      <Header />
        <div className='mainContainer'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hamlet/impresoras" element={<PrintersMainContainer />} />
            <Route path="/hamlet/materiales" element={<StocksMainContainer />} />
            <Route path="/hamlet/jobs" element={<Jobs />} />
          </Routes>  
        </div>
      </BrowserRouter>
  )
}

export default App;
