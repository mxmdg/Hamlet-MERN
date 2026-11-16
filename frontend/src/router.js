import React, { useContext, useEffect } from "react";
import { AuthContext } from "./Components/context/AuthContext";
import { Routes, Route } from "react-router-dom";
import { useUserPreferences } from "./Hooks/useUserPreferences";
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
import { JobsRoutes } from "./Routes/jobsRoutes";
import { preciosRoutes } from "./Routes/preciosRoutes";
import { quotationsRoutes } from "./Routes/quotationsRoutes";
import { configuracionRoutes } from "./Routes/configuracionRoutes";
import { membershipsRoutes } from "./Routes/memberships";
import { papyrusRoutes } from "./Routes/papyrusRoutes";
import { troublesRoutes } from "./Routes/troublesRoute";
import { reportsRoutes } from "./Routes/reportsRoutes";

const Router = (props) => {
  const context = useContext(AuthContext);

  const usePlan = context.usePlan;

  const { color, variant } = props.prefs;

  // ✅ Moved out of render into an effect
  useEffect(() => {
    props.setLog(context.useLogin);
  }, [context.useLogin]);

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes({ color, variant })}

      {context.useLogin === true && (
        <>
          {printersRoutes({ color, variant })}
          {finishersRoutes({ color, variant })}
          {materialesRoutes({ color, variant })}
          {formatosRoutes({ color, variant })}
          {empresasRoutes({ color, variant })}
          {jobPartsRoutes({ color, variant })}
          {usersRoutes({ color, variant })}
          {JobsRoutes({ color, variant })}
          {preciosRoutes({ color, variant })}
          {quotationsRoutes({ color, variant })}
          {configuracionRoutes({ color, variant })}
          {membershipsRoutes({ color, variant })}
          {usePlan === "pro" && papyrusRoutes({ color, variant })}
          {troublesRoutes({ color, variant })}
          {reportsRoutes({ color, variant })}
        </>
      )}

      {/* Error Route */}
      <Route path="/*" element={<Error404 />} />
    </Routes>
  );
};

export default Router;
