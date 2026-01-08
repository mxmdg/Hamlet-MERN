import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FinishersDataForm from "../Components/Formulario/FinishersDataForm";

export const finishersRoutes = () => (
  <>
    <Route path="/finishers" element={<MainContainer entity={"finishers"} />} />
    <Route
      path="/finishers/trash"
      element={<MainContainer entity={"finishers/trash"} />}
    />
    <Route
      path="/finishers/add"
      element={
        <FinishersDataForm
          collection="finishers"
          task="new"
          title="Agregar nuevo Proceso de Terminación"
          color="primary"
          variant="outlined"
        />
      }
    />
    <Route
      path="/finishers/copy/:id"
      element={
        <FinishersDataForm
          collection="finishers"
          task="copy"
          title="Copiar Proceso de Terminación"
          color="primary"
          variant="outlined"
        />
      }
    />
    <Route
      path="/finishers/edit/:id"
      element={
        <FinishersDataForm
          collection="finishers"
          task="edit"
          title="Editar Proceso de Terminación"
          color="primary"
          variant="outlined"
        />
      }
    />
    <Route path="/finishers/queue/:id" element={<></>} />
  </>
);
