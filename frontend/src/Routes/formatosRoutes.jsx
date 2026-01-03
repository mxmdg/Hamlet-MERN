import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import FormatDataForm from "../Components/Formulario/FormatDataForm";

export const formatosRoutes = () => (
  <>
    <Route path="/formatos" element={<MainContainer entity={"formatos"} />} />
    <Route
      path="/formatos/trash"
      element={<MainContainer entity={"formatos/trash"} />}
    />
    <Route
      path="/formatos/add"
      element={
        <FormMaterial form={FormatDataForm} collection="formatos" task="new" />
      }
    />
    <Route
      path="/formatos/copy/:id"
      element={
        <FormMaterial form={FormatDataForm} collection="formatos" task="copy" />
      }
    />
    <Route
      path="/formatos/edit/:id"
      element={
        <FormMaterial form={FormatDataForm} collection="formatos" task="edit" />
      }
    />
  </>
);
