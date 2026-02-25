import React from "react";
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { CircularProgress, Grid, Paper } from "@mui/material";
import Spinner from "../../General/Spinner";

const StatsCollector = ({ children, route }) => {
  const [jobsList, setJobsList] = React.useState([]);
  //const [partsList, setPartsList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Manejo de errores
  const [useError, setError] = React.useState(null);
  const clearError = () => {
    setError(null);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await getPrivateElements(route);
        //const parts = await getPrivateElements("jobs/partes");
        setJobsList(jobs);
        //setPartsList(parts);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(e);
        setLoading(false);
      }
    };
    fetchData();
  }, [route]);

  const loadingSpinner = (
    <Spinner title={`Cargando Estadisticas`} color={"primary"} />
  );
  const failure = (
    <ErrorMessage
      title={"Error cargando estadisticas"}
      message={useError?.response?.data?.message || "Error desconocido"}
      action={clearError}
    />
  );
  const success = (
    <Grid columns={12} container spacing={{ xs: 1, sm: 2, md: 3 }}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <Grid key={child.key} size={{ xs: 12, sm: 12, xl: index === 0 ? 12 : 6 }}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 1,
                  height: "auto",
                  boxShadow: 10,
                  p: 2,
                }}
              >
                {React.cloneElement(child, {
                  jobs: jobsList,
                  route: route,
                  setError: setError,
                  //parts: partsList,
                })}
              </Paper>
            </Grid>
          );
        }
        return (
          <Grid key={child.key} size={{ xs: 12, sm: 12, md: 6 }}>
            <Paper elevation={2}>{child}</Paper>
          </Grid>
        );
      })}
    </Grid>
  );

  return loading ? loadingSpinner : useError ? failure : success;
};

export default StatsCollector;
