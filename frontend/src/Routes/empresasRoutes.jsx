import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import empresasDataForm from "../Components/Formulario/empresasDataForm";
import StatsCollector from "../Components/utils/stats/StatsCollector";
import JobsPerClient from "../Components/utils/stats/JobsPerClient";
import { Grid } from "@mui/material";

export const empresasRoutes = () => (
  <>
    <Route
      path="/empresas"
      element={
        <Grid container columns={12}>
          <Grid item columns={4}>
            <MainContainer entity={"empresas"} />
          </Grid>
          <Grid item columns={4} width={"30%"}>
            <StatsCollector route="jobs/complete">
              <JobsPerClient rank={6} />
            </StatsCollector>
          </Grid>
        </Grid>
      }
    />
    <Route
      path="/empresas/trash"
      element={
        <Grid container columns={12}>
          <Grid item columns={4}>
            <MainContainer entity={"empresas/trash"} />
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
  </>
);
