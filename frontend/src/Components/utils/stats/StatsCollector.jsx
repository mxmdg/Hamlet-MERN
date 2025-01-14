/* import React from "react";
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { CircularProgress } from "@mui/material";
import DarkWoodCard from "../DarkWoodCard";
import { Container, Grid, Typography, Paper } from "@mui/material";

//Importar Calculos
import JobsPerClient from "./JobsPerClient";
import JobsPerSeller from "./JobsPerSeller";
import JobsPerType from "./JobsPerType";
import JobsPerDate from "./JobsPerDate";
import JobsForNextDays from "./JobsForNextWeeks";

const StatsCollector = () => {
  const [jobsList, setJobsList] = React.useState([]);
  const [partsList, setPartsList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Manejo de errores
  const [useError, setError] = React.useState(null);
  const clearError = () => {
    setError(null);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await getPrivateElements("jobs/complete");
        const parts = await getPrivateElements("jobs/partes");
        setJobsList(jobs);
        setPartsList(parts);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isError = <ErrorMessage message={useError} action={clearError} />;

  const isLoading = <CircularProgress />;

  const okContent = (
    <DarkWoodCard>
      <Typography color={"primary"} variant="h4">
        Informacion Estadistica
      </Typography>
      <Grid container columns={12} columnGap={4}>
        <Grid item xs={12} md={12} lg={12} padding={1}>
          <Paper elevation={12} sx={{ p: 2, height: "500px", width: "100%" }}>
            <Typography color="secondary" variant="h5">
              Compromisos próximos días
            </Typography>
            <JobsForNextDays jobs={jobsList} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12} padding={1}>
          <Paper elevation={12} sx={{ p: 2, height: "500px", width: "100%" }}>
            <Typography color="secondary" variant="h5">
              Reporte Mensual
            </Typography>
            <JobsPerDate jobs={jobsList} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3} padding={1}>
          <Paper elevation={12} sx={{ p: 2, height: "500px", width: "100%" }}>
            <Typography color="secondary" variant="h5">
              Top 5: Clientes
            </Typography>
            <JobsPerClient jobs={jobsList} rank={5} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3} padding={1}>
          <Paper elevation={12} sx={{ p: 2, height: "500px", width: "100%" }}>
            <Typography color="secondary" variant="h5">
              Top 10: Vendedores
            </Typography>
            <JobsPerSeller jobs={jobsList} rank={5} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3} padding={1}>
          <Paper elevation={12} sx={{ p: 2, height: "500px", width: "100%" }}>
            <Typography color="secondary" variant="h5">
              Tipos de trabajo
            </Typography>
            <JobsPerType jobs={jobsList} rank={6} />
          </Paper>
        </Grid>
      </Grid>
    </DarkWoodCard>
  );

  const otroContent = <JobsPerClient jobs={jobsList} />;

  return loading ? isLoading : useError !== null ? isError : okContent;
};

export default StatsCollector; */

import React from "react";
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { CircularProgress } from "@mui/material";
import { Container, Grid, Typography, Paper } from "@mui/material";

const StatsCollector = ({ children }) => {
  const [jobsList, setJobsList] = React.useState([]);
  const [partsList, setPartsList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Manejo de errores
  const [useError, setError] = React.useState(null);
  const clearError = () => {
    setError(null);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await getPrivateElements(
          "jobs/complete?Q=65a6862b6e5e2a7318851284&P=Partes.jobParts._id"
        );
        const parts = await getPrivateElements("jobs/partes");
        setJobsList(jobs);
        setPartsList(parts);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (useError !== null)
    return <ErrorMessage message={useError} action={clearError} />;

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return (
            <Paper
              elevation={10}
              sx={{
                p: 2,
                height: "500px",
                minHeight: "500px",
                width: "100%",
                borderBottom: "1px solid #666",
                marginBottom: "10px",
              }}
            >
              {React.cloneElement(child, {
                jobs: jobsList,
                parts: partsList,
              })}
            </Paper>
          );
        }
        return (
          <Paper elevation={10} sx={{ p: 2, height: "500px", width: "100%" }}>
            {child}
          </Paper>
        );
      })}
    </>
  );
};

export default StatsCollector;
