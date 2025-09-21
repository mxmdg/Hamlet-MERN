import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FinishersDataForm from "../Components/Formulario/FinishersDataForm";

export const finishersRoutes = () => (
  <>
    <Route path="/finishers" element={<MainContainer entity={"finishers"} />} />
    <Route
      path="/finishers/add"
      element={<FinishersDataForm collection="finishers" task="new" />}
    />
    <Route
      path="/finishers/copy/:id"
      element={<FinishersDataForm collection="finishers" task="copy" />}
    />
    <Route
      path="/finishers/edit/:id"
      element={<FinishersDataForm collection="finishers" task="edit" />}
    />
  </>
);
