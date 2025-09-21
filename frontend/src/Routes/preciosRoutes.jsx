import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import PricesDataForm from "../Components/Formulario/PricesDataForm";
import FormulaEditor from "../Components/Precioso/FormulaEditor";

export const preciosRoutes = () => (
  <>
    <Route path="/precios" element={<MainContainer entity={"precios"} />} />
    <Route
      path="/precios/edit/:id"
      element={
        <FormMaterial form={PricesDataForm} collection="precios" task="edit" />
      }
    />
    <Route
      path="/precios/add"
      element={
        <FormMaterial form={PricesDataForm} collection="precios" task="new" />
      }
    />
    <Route
      path="/precios/copy/:id"
      element={
        <FormMaterial form={PricesDataForm} collection="precios" task="copy" />
      }
    />
    <Route path="/precios/formula" element={<FormulaEditor />} />
  </>
);
