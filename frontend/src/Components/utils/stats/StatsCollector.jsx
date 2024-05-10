import React from "react";
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { CircularProgress } from "@mui/material";
import DarkWoodCard from "../DarkWoodCard";
import { Grid, Typography } from "@mui/material";

//Importar Calculos
import JobsPerClient from "./JobsPerClient";
import JobsPerSeller from "./JobsPerSeller";
import JobsPerType from "./JobsPerType";

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
      <Typography color={"primary"} variant="h5">
        Contenido cargado correctamente
      </Typography>
      <Grid container columns={12} columnGap={10}>
        <Grid item xs={12} md={6} lg={4} padding={4}>
          <JobsPerClient jobs={jobsList} />
        </Grid>
        <Grid item xs={12} md={6} lg={4} padding={4}>
          <JobsPerSeller jobs={jobsList} />
        </Grid>
        <Grid item xs={12} md={6} lg={4} padding={4}>
          <JobsPerType jobs={jobsList} />
        </Grid>
      </Grid>
    </DarkWoodCard>
  );

  return loading ? isLoading : useError !== null ? isError : okContent;
};

export default StatsCollector;
