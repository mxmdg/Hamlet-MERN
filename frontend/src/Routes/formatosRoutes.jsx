import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import FormatDataForm from "../Components/Formulario/FormatDataForm";

export const formatosRoutes = ({ color, variant }) => (
  <>
    <Route path="/formatos" element={<MainContainer entity={"formatos"} />} />
    <Route
      path="/formatos/trash"
      element={<MainContainer entity={"formatos/trash"} />}
    />
    <Route
      path="/formatos/add"
      element={
        <FormMaterial
          form={FormatDataForm}
          collection="formatos"
          task="new"
          title="Agregar nuevo Formato"
          subtitle="Crear un nuevo formato definiendo sus caracteristicas."
          submitText={"Agregar Formato"}
          variant={variant}
          color={color}
        />
      }
    />
    <Route
      path="/formatos/copy/:id"
      element={
        <FormMaterial
          form={FormatDataForm}
          collection="formatos"
          task="copy"
          title="Copiar Formato"
          subtitle="Crear un nuevo formato basado en uno existente."
          submitText={"Agregar Formato"}
          variant={variant}
          color={color}
        />
      }
    />
    <Route
      path="/formatos/edit/:id"
      element={
        <FormMaterial
          form={FormatDataForm}
          collection="formatos"
          task="edit"
          title="Editar Formato"
          subtitle="Los cambios en las caracteristicas del formato afectaran los trabajos que lo utilicen."
          submitText={"Guardar cambios"}
          variant={variant}
          color={color}
        />
      }
    />
  </>
);
