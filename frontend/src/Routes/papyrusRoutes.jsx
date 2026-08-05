import { Route } from "react-router-dom";
import MainContainer from "../Components/Pages/MainContainer";
import PapyrusCopy from "../Components/Pages/PapyrusCopy";
import FormMaterial from "../Components/Formulario/FormMaterial";
import empresasDataForm from "../Components/Formulario/empresasDataForm"

// La fecha "desde" para la grilla la calcula el frontend (hoy, con guiones:
// formato YYYY-MM-DD que el backend valida). Ya no se importa SQL.
const hoyISO = new Date().toISOString().split("T")[0];

export const papyrusRoutes = ({ color, variant }) => (
  <>
    <Route
      path="/papyrus"
      element={
        <MainContainer
          entity={"papyrus"}
          queryName={"procesosPorFecha"}
          queryParams={{ desde: hoyISO }}
        />
      }
    />
    <Route
      path="/papyrus_clientes"
      element={
        <MainContainer
          entity={"papyrus"}
          queryName={"clientes"}
        />
      }
    />
    <Route path="/papyrus/copy/:id" element={<PapyrusCopy />} />
    <Route path="/papyrus/edit/:id" element={<PapyrusCopy />} />
  </>
);
