import React from "react";
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { CircularProgress, Grid, Paper } from "@mui/material";

const StatsCollector = ({ children, route }) => {
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
        const jobs = await getPrivateElements(route);
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
  }, [route]);

  if (loading) return <CircularProgress />;
  if (useError !== null)
    return <ErrorMessage message={useError} action={clearError} />;

  return (
    <Grid
      columns={12}
      container
      spacing={{ sm: 1, md: 2, xl: 3 }}
      sx={{ margin: 2 }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return (
            <Grid item xs={12} sm={6} xl={6}>
              <Paper
                elevation={10}
                sx={{
                  borderRadius: 4,
                  height: "450px",
                  boxShadow: 10,
                  p: 2,
                  border: "1px solid #666",
                }}
              >
                {React.cloneElement(child, {
                  jobs: jobsList,
                  parts: partsList,
                })}
              </Paper>
            </Grid>
          );
        }
        return (
          <Grid item xs={12} sm={6} md={6} key={child.key}>
            <Paper elevation={10} sx={{ p: 2, height: "500px", width: "100%" }}>
              {child}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCollector;
