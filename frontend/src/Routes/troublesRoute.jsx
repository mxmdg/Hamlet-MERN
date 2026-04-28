import { Route } from "react-router-dom";
import TroublesDataForm from "../Components/Formulario/troublesDataForm";
import CotFetcher from "../Components/cottizations/CotFetcher";
import MainContainer from "../Components/Pages/MainContainer";

export const troublesRoutes = ({ color, variant }) => (
  <>
    <Route path="/troubles" element={<MainContainer entity={"troubles"} />} />
    <Route
      path="/troubles/add"
      element={
        <TroublesDataForm
          collection="troubles"
          task="new"
          title="Agregar Falla"
          subtitle="Describir una nueva falla."
          submitText={"Agregar Falla"}
          variant={variant}
          color={color}
        />
      }
    />
    <Route
      path="/troubles/copy/:id"
      element={
        <TroublesDataForm
          collection="troubles"
          task="copy"
          title="Copiar Falla"
          subtitle="Describir un nuevo falla."
          submitText={"Agregar Falla"}
          variant={variant}
          color={color}
        />
      }
    />
    <Route
      path="/troubles/edit/:id"
      element={
        <TroublesDataForm
          collection="troubles"
          task="edit"
          title="Editar Falla"
          subtitle="Llevar un correcto registro de las fallas permite hacer mas eficiente la produccion."
          submitText={"Guardar cambios"}
          variant={variant}
          color={color}
        />
      }
    />
    <Route
      path="/troubles/trash"
      element={<MainContainer entity={"troubles/trash"} />}
    />
    <Route path="/troubles/edit/:id" element={<CotFetcher />} />
  </>
);
