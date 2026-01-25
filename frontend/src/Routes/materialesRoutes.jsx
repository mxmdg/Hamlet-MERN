import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import StockDataForm from "../Components/Formulario/StockDataForm";

export const materialesRoutes = ({ color, variant }) => (
  <>
    <Route
      path="/materiales"
      element={<MainContainer entity={"materiales"} />}
    />
    <Route
      path="/materiales/trash"
      element={<MainContainer entity={"materiales/trash"} />}
    />
    <Route
      path="/materiales/add"
      element={
        <FormMaterial
          form={StockDataForm}
          collection="materiales"
          task="new"
          title="Agregar Material"
          variant={variant}
          color={color}
        />
      }
    />
    <Route
      path="/materiales/copy/:id"
      element={
        <FormMaterial
          form={StockDataForm}
          collection="materiales"
          task="copy"
          title="Copiar Material"
          variant={variant}
          color={color}
        />
      }
    />
    <Route
      path="/materiales/edit/:id"
      element={
        <FormMaterial
          form={StockDataForm}
          collection="materiales"
          task="edit"
          title="Editar Material"
          variant={variant}
          color={color}
        />
      }
    />
  </>
);
