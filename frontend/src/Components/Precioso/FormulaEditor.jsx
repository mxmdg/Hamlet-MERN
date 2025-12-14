import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import SimpleAreaChart from "../utils/stats/SimpleAreaChart";
import { ResponsiveContainer } from "recharts";

import { productoPorUnidad, pliegoPorLongitud } from "./formulas";
import FormMaterial from "../Formulario/FormMaterial";
import FormulaTestForm from "../Formulario/FormulaTestForm";

const FormulaEditor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [papyrusExport, setPapyrusExport] = useState("");
  const [parameters, setParameters] = useState(null);

  const formulaAnalisis = (
    formula,
    Valor,
    Minimo,
    Entrada,
    largoPliego,
    Breakpoints = [],
    minRange,
    maxRange,
    rangeStep = 1
  ) => {
    const datos = [];
    for (let i = minRange; i <= maxRange; i += rangeStep) {
      // Modified loop condition and increment
      const resultado = formula(
        Valor,
        Minimo,
        Entrada,
        i,
        largoPliego,
        Breakpoints
      );
      setPapyrusExport(resultado.Papyrus);
      datos.push({
        Cantidad: i,
        Valor: Valor,
        Unitario: resultado.Unitario,
        Total: resultado.Total,
      });
    }
    return datos;
  };

  useEffect(() => {
    try {
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }, []);

  const graficar = (values) => {
    setParameters(values);
    console.log(values);
    const formulas = { productoPorUnidad, pliegoPorLongitud };
    const datos = formulaAnalisis(
      formulas[values.Formula],
      Number(values.Valor),
      Number(values.Minimo),
      Number(values.Entrada),
      Number(values.Longitud),
      [Number(values.firstBreakpoint), Number(values.secondBreakpoint)],
      Number(values.minRange),
      Number(values.maxRange),
      Number(values.stepRange)
    );
    setData(datos);
  };

  const resetError = () => {
    setError(null);
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
        Formula
      </Typography>
      <ResponsiveContainer height={300} width="100%">
        <SimpleAreaChart
          data={data}
          dataKey={["Cantidad", "Total", "Valor", "Unitario"]}
        />
      </ResponsiveContainer>

      <FormMaterial
        form={FormulaTestForm}
        action={graficar}
        collection="precios"
        task="new"
      />
      {data.length > 0 && (
        <ErrorMessage
          message={papyrusExport}
          severity="success"
          title="Exportación Papyrus"
        />
      )}
    </Box>
  );
};

export default FormulaEditor;
