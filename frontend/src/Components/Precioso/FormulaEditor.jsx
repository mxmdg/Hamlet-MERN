import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import SimpleAreaChart from "../utils/stats/SimpleAreaChart";
import { ResponsiveContainer } from "recharts";

const FormulaEditor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {}, []);

  const resetError = () => {
    setError(null);
    setLoading(true);
    setData(null);
    // Re-fetch data
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ErrorMessage message={error} action={resetError} severity="error" />
        <Button
          onClick={resetError}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {data.message}
      </Typography>
      <ResponsiveContainer height={300} width={450}>
        <SimpleAreaChart />
      </ResponsiveContainer>

      <Button variant="contained" color="primary">
        Action
      </Button>
    </Box>
  );
};

export default FormulaEditor;
