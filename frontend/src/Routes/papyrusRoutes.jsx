import { Route } from "react-router-dom";
import MainContainer from "../Components/Pages/MainContainer";
import PapyrusCopy from "../Components/Pages/PapyrusCopy";
import {
  MyQuery,
  queryOT,
  queryProcesos,
  queryEntrega,
  queryProcesosPorFecha,
  queryProximasEntregas,
  queryTrabajosTerceros,
  finalQuery,
} from "../Components/utils/PropertiesMaps/sqlQueries";

export const papyrusRoutes = ({ color, variant }) => (
  <>
    <Route
      path="/papyrus"
      element={
        <MainContainer
          entity={"papyrus"}
          querySQL={{ sql: queryProcesosPorFecha }}
        />
      }
    />
    <Route path="/papyrus/copy/:id" element={<PapyrusCopy />} />
    <Route path="/papyrus/edit/:id" element={<PapyrusCopy />} />
  </>
);
