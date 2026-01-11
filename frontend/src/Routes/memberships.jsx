import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import { Register } from "../Components/Users/Register";
import membershipsDataForm from "../Components/Formulario/membershipsDataForm";
import { RegPage } from "../Components/Users/RegPage";

export const membershipsRoutes = () => (
  <>
    <Route
      path="/memberships"
      element={<MainContainer entity={"memberships"} />}
    />
    <Route
      path="/memberships/trash"
      element={<MainContainer entity={"memberships/trash"} />}
    />
    <Route path="/memberships/add" element={<RegPage />} />

    <Route
      path="/memberships/edit/:id"
      element={
        <FormMaterial
          form={membershipsDataForm}
          collection="memberships"
          task="edit"
          title="Editar Membresía"
          variant="outlined"
          color="primary"
        />
      }
    />

    <Route
      path="/memberships/copy/:id"
      element={
        <FormMaterial
          form={membershipsDataForm}
          collection="memberships"
          task="copy"
          title="Copiar Membresía"
          variant="outlined"
          color="primary"
        />
      }
    />
  </>
);
