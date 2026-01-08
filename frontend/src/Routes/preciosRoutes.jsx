import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import PricesDataForm from "../Components/Formulario/PricesDataForm";
import FormulaEditor from "../Components/Precioso/FormulaEditor";

export const preciosRoutes = () => (
  <>
    <Route path="/precios" element={<MainContainer entity={"precios"} />} />
    <Route
      path="/precios/trash"
      element={<MainContainer entity={"precios/trash"} />}
    />
    <Route
      path="/precios/edit/:id"
      element={
        <FormMaterial
          form={PricesDataForm}
          collection="precios"
          task="edit"
          title="Editar Precio"
          variant="outlined"
          color="primary"
        />
      }
    />
    <Route
      path="/precios/add"
      element={
        <FormMaterial
          form={PricesDataForm}
          collection="precios"
          task="new"
          title="Agregar Precio"
          variant="outlined"
          color="primary"
        />
      }
    />
    <Route
      path="/precios/copy/:id"
      element={
        <FormMaterial
          form={PricesDataForm}
          collection="precios"
          task="copy"
          title="Copiar Precio"
          variant="outlined"
          color="primary"
        />
      }
    />
    <Route path="/precios/formula" element={<FormulaEditor />} />
  </>
);
