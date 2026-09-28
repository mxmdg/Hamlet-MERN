import { Route } from "react-router-dom";
import MonthlyReport from "../Components/reports/MonthlyReport";

export const reportsRoutes = () => (
  <>
    <Route path="/reportes" element={<MonthlyReport />} />
    <Route path="/reportes/:periodo" element={<MonthlyReport />} />
  </>
);
