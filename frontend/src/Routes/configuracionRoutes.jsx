import { Route } from "react-router-dom";
import ConfigMainContainer from "../Components/Config/ConfigMainContainer";
import FormatsMainContainer from "../Components/Formats/FormatsMainContainer";
import StocksMainContainer from "../Components/Stocks/StocksMainContainer";
import PrintersMainContainer from "../Components/Printers/PrintersMainContainer";

export const configuracionRoutes = () => (
  <>
    <Route path="/configuracion" element={<ConfigMainContainer />} />
    <Route path="/configuracion/formatos" element={<FormatsMainContainer />} />
    <Route path="/configuracion/materiales" element={<StocksMainContainer />} />
    <Route
      path="/configuracion/impresoras"
      element={<PrintersMainContainer />}
    />
  </>
);
