import { Route } from "react-router-dom";
import ConfigMainContainer from "../Components/Config/ConfigMainContainer";
import FormatsMainContainer from "../Components/Formats/FormatsMainContainer";
import StocksMainContainer from "../Components/Stocks/StocksMainContainer";
import PrintersMainContainer from "../Components/Printers/PrintersMainContainer";
import preferencesForm from "../Components/Formulario/NewMessageForm";
import FormMaterial from "../Components/Formulario/FormMaterial";

export const configuracionRoutes = () => (
  <>
    <Route path="/configuracion" element={<ConfigMainContainer />} />
    <Route path="/configuracion/formatos" element={<FormatsMainContainer />} />
    <Route path="/configuracion/materiales" element={<StocksMainContainer />} />
    <Route
      path="/configuracion/impresoras"
      element={<PrintersMainContainer />}
    />
    <Route
      path="/tenant/settings/:id"
      element={
        <FormMaterial
          form={preferencesForm}
          collection="tenants/settings"
          task="edit"
          title={"Ajustes del sistema"}
          subtitle={"Configuraciones generales de la aplicación"}
          submitText={"Guardar cambios"}
        />
      }
    />
  </>
);
