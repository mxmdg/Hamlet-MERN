import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import { Register } from "../Components/Users/Register";
import membershipsDataForm from "../Components/Formulario/membershipsDataForm";
import { RegPage } from "../Components/Users/RegPage";

export const membershipsRoutes = ({ color, variant }) => (
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
          subtitle="Modificar el rol asignado a un usuario."
          submitText={"Guardar cambios"}
          color={color}
          variant={variant}
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
          subtitle="Asignar rol a un usuario existente."
          submitText={"Agregar Membresía"}
          color={color}
          variant={variant}
        />
      }
    />
  </>
);
