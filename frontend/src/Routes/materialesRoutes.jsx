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
          subtitle="Las caracteristicas del material son parte fundamental en los calculos del sistema."
          submitText={"Agregar Material"}
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
          subtitle="Crear un nuevo material basado en el material seleccionado."
          submitText={"Agregar Material"}
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
          subtitle="Los cambios en las caracteristicas del material afectaran pedidos anteriores."
          submitText={"Guardar cambios"}
          variant={variant}
          color={color}
        />
      }
    />
  </>
);
