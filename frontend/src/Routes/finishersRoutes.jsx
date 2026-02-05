import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FinishersDataForm from "../Components/Formulario/FinishersDataForm";

export const finishersRoutes = ({ color, variant }) => (
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
          subtitle="Definir las caracteristicas principales del proceso de terminación. Asignar costo y habilitar su uso en los trabajos y partes seleccionados."
          submitText={"Agregar Proceso"}
          variant={variant}
          color={color}
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
          subtitle="Agregar un nuevo proceso de terminación basado en el proceso seleccionado."
          submitText={"Agregar Proceso"}
          variant={variant}
          color={color}
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
          subtitle="Los cambios en las caracteristicas del proceso de terminación afectaran los trabajos que lo utilicen."
          submitText={"Guardar cambios"}
          variant={variant}
          color={color}
        />
      }
    />
    <Route path="/finishers/queue/:id" element={<></>} />
  </>
);
