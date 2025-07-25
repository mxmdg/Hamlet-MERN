import React from "react";
import { useContext } from "react";
import { AuthContext } from "./Components/context/AuthContext";
import { Routes, Route } from "react-router-dom";
import MainContainer from "./Components/General/MainContainer";
import PartsContainer from "./Components/General/PartsContainer";
import { Register } from "./Components/Users/Register";
import { Login } from "./Components/Users/Login";
import { Profile } from "./Components/Users/Profile";
import { LogPage } from "./Components/Users/LogPage";
import ChangePassword from "./Components/Users/ChangePassword";
import ResetPassword from "./Components/Users/RecoverPassword";
import Home from "./Components/home";
import Form from "./Components/Formulario/Form";
import FormMaker from "./Components/Formulario/FormMaker";
import FormMaterial from "./Components/Formulario/FormMaterial";
import PrintersDataForm from "./Components/Formulario/PrintersDataForm";
import StockDataForm from "./Components/Formulario/StockDataForm";
import FormatDataForm from "./Components/Formulario/FormatDataForm";
import empresasDataForm from "./Components/Formulario/empresasDataForm";
import jobPartDataForm from "./Components/Formulario/JobPartsDataForm";
import PricesDataForm from "./Components/Formulario/PricesDataForm";
import UsersDataForm from "./Components/Formulario/UsersDataForm";
import FinishersDataForm from "./Components/Formulario/FinishersDataForm";
import MyStepper from "./Components/Jobs/Stepper";
import JobsContainer from "./Components/Jobs/JobsContainer";
import { JobViewer } from "./Components/jobViewer/JobViewer";
import FormulaEditor from "./Components/Precioso/FormulaEditor";
import CotFetcher from "./Components/cottizations/CotFetcher";

// Job Context Files
import { JobProvider, JobContext } from "./Components/Jobs/JobContext";
import CurrentJob from "./Components/Jobs/JobContextChildren/CurrentJob";

import ConfigMainContainer from "./Components/Config/ConfigMainContainer";
import StocksMainContainer from "./Components/Stocks/StocksMainContainer";
import FormatsMainContainer from "./Components/Formats/FormatsMainContainer";
import PrintersMainContainer from "./Components/Printers/PrintersMainContainer";
import FullJobsRender from "./Components/Pages/FullJobsRender";
import JobsEditAndCopy from "./Components/Pages/JobsEditAndCopy";
import JobParts from "./Components/Jobs/JobsParts";
import Machines from "./Components/Pages/Machines";
import Error404 from "./Components/Pages/Error404";

// MUI Material
import { Grid, Typography } from "@mui/material";

// Datos Estadisticos
import StatsCollector from "./Components/utils/stats/StatsCollector";
import JobsForNextDays from "./Components/utils/stats/JobsForNextWeeks";
import JobsPerDate from "./Components/utils/stats/JobsPerDate";
import JobsPerClient from "./Components/utils/stats/JobsPerClient";
import JobsPerSeller from "./Components/utils/stats/JobsPerSeller";
import JobsPerType from "./Components/utils/stats/JobsPerType";
import JobFinder from "./Components/Jobs/JobFinder";
import {
  JobProperties,
  QuotationProperties,
} from "./Components/utils/PropertiesMaps/jobsMap";
import { headers } from "./Components/Jobs/jobsTable/headers";

const Router = () => {
  const context = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users/reset-password/:token" element={<ResetPassword />} />

      {context.useLogin === true && (
        <>
          {/* Impresoras Routes */}
          <Route
            path="/impresoras"
            element={<MainContainer entity={"impresoras"} />}
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
              />
            }
          />

          {/* Finishers Routes */}
          <Route
            path="/finishers"
            element={<MainContainer entity={"finishers"} />}
          />
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

          {/* Materiales Routes */}
          <Route
            path="/materiales"
            element={<MainContainer entity={"materiales"} />}
          />
          <Route
            path="/materiales/add"
            element={
              <FormMaterial
                form={StockDataForm}
                collection="materiales"
                task="new"
              />
            }
          />
          <Route
            path="/materiales/copy/:id"
            element={
              <FormMaterial
                form={StockDataForm}
                collection="materiales"
                task="copy"
              />
            }
          />
          <Route
            path="/materiales/edit/:id"
            element={
              <FormMaterial
                form={StockDataForm}
                collection="materiales"
                task="edit"
              />
            }
          />

          {/* Formatos Routes */}
          <Route
            path="/formatos"
            element={<MainContainer entity={"formatos"} />}
          />
          <Route
            path="/formatos/add"
            element={
              <FormMaterial
                form={FormatDataForm}
                collection="formatos"
                task="new"
              />
            }
          />
          <Route
            path="/formatos/copy/:id"
            element={
              <FormMaterial
                form={FormatDataForm}
                collection="formatos"
                task="copy"
              />
            }
          />
          <Route
            path="/formatos/edit/:id"
            element={
              <FormMaterial
                form={FormatDataForm}
                collection="formatos"
                task="edit"
              />
            }
          />

          {/* Empresas Routes */}
          <Route
            path="/empresas"
            element={
              <Grid container columns={12}>
                <Grid item columns={4}>
                  <MainContainer entity={"empresas"} />
                </Grid>
                <Grid item columns={8}>
                  <StatsCollector route="jobs/complete">
                    <JobsPerClient rank={6} />
                  </StatsCollector>
                </Grid>
              </Grid>
            }
          />
          <Route
            path="/empresas/add"
            element={
              <FormMaterial
                form={empresasDataForm}
                collection="empresas"
                task="new"
              />
            }
          />
          <Route
            path="/empresas/copy/:id"
            element={
              <FormMaterial
                form={empresasDataForm}
                collection="empresas"
                task="copy"
              />
            }
          />
          <Route
            path="/empresas/edit/:id"
            element={
              <FormMaterial
                form={empresasDataForm}
                collection="empresas"
                task="edit"
              />
            }
          />

          {/* JobParts Routes */}
          <Route
            path="/JobParts"
            element={<MainContainer entity={"JobParts"} />}
          />
          <Route
            path="/JobParts/add"
            element={
              <FormMaterial
                form={jobPartDataForm}
                collection="JobParts"
                task="new"
              />
            }
          />
          <Route
            path="/JobParts/copy/:id"
            element={
              <FormMaterial
                form={jobPartDataForm}
                collection="JobParts"
                task="copy"
              />
            }
          />
          <Route
            path="/JobParts/edit/:id"
            element={
              <FormMaterial
                form={jobPartDataForm}
                collection="JobParts"
                task="edit"
              />
            }
          />

          {/* Users Routes */}
          <Route path="/users" element={<MainContainer entity={"users"} />} />
          <Route path="/users/add" element={<Register />} />
          <Route path="/users/profile" element={<Profile />} />
          <Route path="/users/ChangePassword" element={<ChangePassword />} />
          <Route
            path="/users/edit/:id"
            element={
              <FormMaterial
                form={UsersDataForm}
                collection="users"
                task="edit"
              />
            }
          />

          {/* Jobs Routes */}
          <Route
            path="/Jobs"
            element={
              <JobFinder
                entity={"jobs/complete"}
                propertiesMap={JobProperties}
              />
            }
          />
          <Route
            path="/Jobs/partes"
            element={<MainContainer entity={"jobs/partes"} />}
          />
          <Route
            path="/Jobs/stats"
            element={
              <StatsCollector route="jobs/complete">
                <JobsPerDate />
                <JobsPerType />
                <JobsPerClient rank={6} />
                <JobsPerSeller />
                <JobsPerType />
              </StatsCollector>
            }
          />
          <Route path="/Jobs/add" element={<MyStepper />} />
          <Route
            path="Jobs/Context/:id"
            element={
              <JobProvider>
                <CurrentJob />
              </JobProvider>
            }
          />
          <Route
            path="Jobs/Context"
            element={
              <JobProvider>
                <CurrentJob />
              </JobProvider>
            }
          />
          <Route
            path="/Jobs/edit/:id"
            element={<JobViewer entity={"Jobs"} />}
          />
          <Route path="/Jobs/copy/:id" element={<JobsEditAndCopy />} />
          <Route
            path="/Jobs/fullList"
            element={<JobsContainer entity={"Jobs"} />}
          />

          {/* Precios Routes */}
          <Route
            path="/precios"
            element={<MainContainer entity={"precios"} />}
          />
          <Route
            path="/precios/edit/:id"
            element={
              <FormMaterial
                form={PricesDataForm}
                collection="precios"
                task="edit"
              />
            }
          />
          <Route
            path="/precios/add"
            element={
              <FormMaterial
                form={PricesDataForm}
                collection="precios"
                task="new"
              />
            }
          />
          <Route
            path="/precios/copy/:id"
            element={
              <FormMaterial
                form={PricesDataForm}
                collection="precios"
                task="copy"
              />
            }
          />
          <Route path="/precios/formula" element={<FormulaEditor />} />

          {/* Quotations Routes */}

          <Route
            path="/quotations"
            element={
              <JobFinder
                entity={"quotations"}
                propertiesMap={QuotationProperties}
              />
            }
          />
          <Route path="/quotations/edit/:id" element={<CotFetcher />} />

          {/* Configuracion Routes */}
          <Route path="/configuracion" element={<ConfigMainContainer />} />
          <Route
            path="/configuracion/formatos"
            element={<FormatsMainContainer />}
          />
          <Route
            path="/configuracion/materiales"
            element={<StocksMainContainer />}
          />
          <Route
            path="/configuracion/impresoras"
            element={<PrintersMainContainer />}
          />
        </>
      )}

      {/* Error Route */}
      <Route path="/*" element={<Error404 />} />
    </Routes>
  );
};

export default Router;
