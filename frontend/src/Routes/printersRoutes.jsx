import { Routes, Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import PrintersMainContainer from "../Components/Printers/PrintersMainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import PrintersDataForm from "../Components/Formulario/PrintersDataForm";

export const printersRoutes = () => {
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
            variant="outlined"
            color="primary"
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
            variant="outlined"
            color="primary"
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
            variant="outlined"
            color="primary"
          />
        }
      />
    </>
  );
};
