import React from "react";
import { useContext } from "react";
import { AuthContext } from "./Components/context/AuthContext";
import { Routes, Route } from "react-router-dom";

import Error404 from "./Components/Pages/Error404";

// Rutas
import { publicRoutes } from "./Routes/publicRoutes";
import { printersRoutes } from "./Routes/printersRoutes";
import { finishersRoutes } from "./Routes/finishersRoutes";
import { materialesRoutes } from "./Routes/materialesRoutes";
import { formatosRoutes } from "./Routes/formatosRoutes";
import { empresasRoutes } from "./Routes/empresasRoutes";
import { jobPartsRoutes } from "./Routes/jobPartsRoutes";
import { usersRoutes } from "./Routes/usersRoutes";
import { jobsRoutes } from "./Routes/jobsRoutes";
import { preciosRoutes } from "./Routes/preciosRoutes";
import { quotationsRoutes } from "./Routes/quotationsRoutes";
import { configuracionRoutes } from "./Routes/configuracionRoutes";

const Router = () => {
  const context = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes()}

      {context.useLogin === true && (
        <>
          {printersRoutes()}
          {finishersRoutes()}
          {materialesRoutes()}
          {formatosRoutes()}
          {empresasRoutes()}
          {jobPartsRoutes()}
          {usersRoutes()}
          {jobsRoutes()}
          {preciosRoutes()}
          {quotationsRoutes()}
          {configuracionRoutes()}
        </>
      )}

      {/* Error Route */}
      <Route path="/*" element={<Error404 />} />
    </Routes>
  );
};

export default Router;
