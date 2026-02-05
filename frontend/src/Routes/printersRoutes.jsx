import { Routes, Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import PrintersMainContainer from "../Components/Printers/PrintersMainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import PrintersDataForm from "../Components/Formulario/PrintersDataForm";

export const printersRoutes = ({ color, variant }) => {
  return (
    <>
      <Route
        path="/impresoras"
        element={<MainContainer entity={"impresoras"} />}
      />
      <Route
        path="/impresoras/trash"
        element={<MainContainer entity={"impresoras/trash"} />}
      />
      <Route
        path="/billing"
        element={<PrintersMainContainer entity={"impresoras"} />}
      />
      <Route
        path="/impresoras/add"
        element={
          <FormMaterial
            form={PrintersDataForm}
            collection="impresoras"
            task="new"
            title="Agregar Impresora"
            subtitle="Define las caracteristicas de la impresora, si es necesario recurre al manual del usuario."
            submitText={"Agregar Impresora"}
            variant={variant}
            color={color}
          />
        }
      />
      <Route
        path="/impresoras/copy/:id"
        element={
          <FormMaterial
            form={PrintersDataForm}
            collection="impresoras"
            task="copy"
            title="Copiar Impresora"
            subtitle="Definir una nueva impresora a partir de la impresora seleccionada."
            submitText={"Agregar Impresora"}
            variant={variant}
            color={color}
          />
        }
      />
      <Route
        path="/impresoras/edit/:id"
        element={
          <FormMaterial
            form={PrintersDataForm}
            collection="impresoras"
            task="edit"
            title="Editar Impresora"
            subtitle="La configuracion de las impresoras es importante para el correcto funcionamiento del sistema de costos."
            submitText={"Guardar cambios"}
            variant={variant}
            color={color}
          />
        }
      />
    </>
  );
};
