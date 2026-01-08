import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import jobPartDataForm from "../Components/Formulario/JobPartsDataForm";
import StatsCollector from "../Components/utils/stats/StatsCollector";
import JobsPerPartType from "../Components/utils/stats/JobsPerPartType";
import { Grid } from "@mui/material";

export const jobPartsRoutes = () => (
  <>
    <Route
      path="/JobParts"
      element={
        <Grid container columns={12}>
          <Grid item columns={4}>
            <MainContainer entity={"JobParts"} />
          </Grid>
          <Grid item columns={4} width={"30%"}>
            <StatsCollector route="jobs/complete">
              <JobsPerPartType rank={10} />
            </StatsCollector>
          </Grid>
        </Grid>
      }
    />
    <Route
      path="/JobParts/trash"
      element={<MainContainer entity={"JobParts/trash"} />}
    />
    <Route
      path="/JobParts/add"
      element={
        <FormMaterial
          form={jobPartDataForm}
          collection="JobParts"
          task="new"
          title="Agregar Parte de Trabajo"
          color="primary"
          variant="outlined"
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
          title="Copiar Parte de Trabajo"
          color="primary"
          variant="outlined"
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
          title="Editar Parte de Trabajo"
          color="primary"
          variant="outlined"
        />
      }
    />
  </>
);
