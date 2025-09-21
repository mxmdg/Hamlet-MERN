import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import StockDataForm from "../Components/Formulario/StockDataForm";

export const materialesRoutes = () => (
  <>
    <Route
      path="/materiales"
      element={<MainContainer entity={"materiales"} />}
    />
    <Route
      path="/materiales/add"
      element={
        <FormMaterial form={StockDataForm} collection="materiales" task="new" />
      }
    />
    <Route
      path="/materiales/copy/:id"
      element={
        <FormMaterial
          form={StockDataForm}
          collection="materiales"
          task="copy"
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
        />
      }
    />
  </>
);
