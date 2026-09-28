import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import TopBarChart from "../utils/stats/TopBarChart";

/*
 * Reporte mensual de cotizaciones.
 * /reportes          -> último mes completo
 * /reportes/2026-09  -> el mes indicado (es el link que va en el mail)
 *
 * Los datos vienen de GET /Hamlet/reports/monthly/:periodo (solo admin).
 */

const PERIODO_VALIDO = /^\d{4}-(0[1-9]|1[0-2])$/;

// Último mes completo en hora argentina (UTC-3), como "AAAA-MM"
const ultimoMesCompleto = () => {
  const ahoraAR = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const mesAnterior = new Date(
    Date.UTC(ahoraAR.getUTCFullYear(), ahoraAR.getUTCMonth() - 1, 1),
  );
  const mes = String(mesAnterior.getUTCMonth() + 1).padStart(2, "0");
  return `${mesAnterior.getUTCFullYear()}-${mes}`;
};

// "2026-09" -> "septiembre de 2026"
const nombreDelMes = (periodo) => {
  const [anio, mes] = periodo.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, 1)).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatoCantidad = (valor) => valor.toLocaleString("es-AR");

const panelSx = { borderRadius: 1, height: "100%", boxShadow: 10, p: 2 };

// Variación % con flecha y color. null = el período de comparación no tiene datos
const Variacion = ({ valor }) => {
  if (valor === null || valor === undefined) {
    return (
      <Typography component="span" variant="body2" color="text.secondary">
        (sin datos)
      </Typography>
    );
  }
  const color =
    valor > 0 ? "success.main" : valor < 0 ? "error.main" : "text.secondary";
  const flecha = valor > 0 ? "▲" : valor < 0 ? "▼" : "=";
  return (
    <Typography component="span" variant="body2" sx={{ color }}>
      {flecha} {Math.abs(valor).toLocaleString("es-AR")}%
    </Typography>
  );
};

// Tarjeta con el valor del mes y su comparación contra los otros dos períodos.
// Siempre muestra el valor absoluto al lado del %: con bases chicas el % solo engaña.
const Indicador = ({ titulo, reporte, campo, formato }) => (
  <Paper elevation={2} sx={panelSx}>
    <Typography variant="overline" color="text.secondary">
      {titulo}
    </Typography>
    <Typography variant="h4" sx={{ mb: 1 }}>
      {formato(reporte.actual[campo])}
    </Typography>
    <Typography variant="body2">
      Mes anterior: {formato(reporte.mesAnterior[campo])}{" "}
      <Variacion valor={reporte.variacion.mesAnterior[campo]} />
    </Typography>
    <Typography variant="body2">
      Mismo mes del año pasado: {formato(reporte.anioAnterior[campo])}{" "}
      <Variacion valor={reporte.variacion.anioAnterior[campo]} />
    </Typography>
  </Paper>
);

// Une los grupos (por vendedor o por tipo) de los tres períodos, fila por fila
const unirGrupos = (reporte, clave) => {
  const filas = {};
  ["actual", "mesAnterior", "anioAnterior"].forEach((periodo) => {
    reporte[periodo][clave].forEach((grupo) => {
      if (!filas[grupo.nombre]) filas[grupo.nombre] = { nombre: grupo.nombre };
      filas[grupo.nombre][periodo] = grupo;
    });
  });
  return Object.values(filas).sort(
    (a, b) => (b.actual?.neto || 0) - (a.actual?.neto || 0),
  );
};

const CeldaGrupo = ({ grupo }) => (
  <TableCell align="right">
    {grupo ? `${pesos.format(grupo.neto)} (${grupo.cantidad})` : "—"}
  </TableCell>
);

const TablaComparativa = ({ titulo, reporte, clave }) => {
  const filas = unirGrupos(reporte, clave);
  return (
    <Paper elevation={2} sx={panelSx}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {titulo}
      </Typography>
      {filas.length === 0 ? (
        <Typography color="text.secondary">Sin cotizaciones</Typography>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Este mes</TableCell>
                <TableCell align="right">Mes anterior</TableCell>
                <TableCell align="right">Año anterior</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filas.map((fila) => (
                <TableRow key={fila.nombre}>
                  <TableCell>{fila.nombre}</TableCell>
                  <CeldaGrupo grupo={fila.actual} />
                  <CeldaGrupo grupo={fila.mesAnterior} />
                  <CeldaGrupo grupo={fila.anioAnterior} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography variant="caption" color="text.secondary">
        Neto (cantidad de cotizaciones)
      </Typography>
    </Paper>
  );
};

const GraficoNeto = ({ titulo, datos }) => (
  <Paper elevation={2} sx={panelSx}>
    {datos.length === 0 ? (
      <>
        <Typography variant="h6">{titulo}</Typography>
        <Typography color="text.secondary">Sin cotizaciones</Typography>
      </>
    ) : (
      <TopBarChart
        title={titulo}
        data={datos}
        dataKey={{ cat: "nombre", qty: "neto" }}
      />
    )}
  </Paper>
);

const MonthlyReport = () => {
  const { periodo: periodoURL } = useParams();
  const navigate = useNavigate();
  const periodo = periodoURL || ultimoMesCompleto();
  const periodoValido = PERIODO_VALIDO.test(periodo);

  const [reporte, setReporte] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Manejo de errores
  const [useError, setError] = React.useState(null);
  const clearError = () => {
    setError(null);
  };

  React.useEffect(() => {
    if (!periodoValido) {
      setLoading(false);
      return;
    }

    // Si se cambia de mes antes de que llegue la respuesta, se descarta la vieja
    let cancelado = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPrivateElements(`reports/monthly/${periodo}`);
        if (!cancelado) setReporte(data);
      } catch (e) {
        if (!cancelado) setError(e);
      } finally {
        if (!cancelado) setLoading(false);
      }
    };
    fetchData();

    return () => {
      cancelado = true;
    };
  }, [periodo, periodoValido]);

  const selector = (
    <TextField
      type="month"
      label="Mes"
      size="small"
      value={periodoValido ? periodo : ""}
      InputLabelProps={{ shrink: true }}
      onChange={(e) => {
        if (e.target.value) navigate(`/reportes/${e.target.value}`);
      }}
    />
  );

  let contenido;
  if (!periodoValido) {
    contenido = (
      <Typography color="error">
        El período "{periodo}" no es válido. Elegí un mes en el selector.
      </Typography>
    );
  } else if (loading) {
    contenido = <Spinner title={`Cargando reporte`} color={"primary"} />;
  } else if (useError) {
    contenido = (
      <ErrorMessage
        title={"Error cargando el reporte"}
        message={
          useError?.response?.data?.message ||
          useError?.message ||
          "Error desconocido"
        }
        action={clearError}
      />
    );
  } else if (reporte) {
    contenido = (
      <Grid columns={12} container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Indicador
            titulo="Cotizaciones"
            reporte={reporte}
            campo="cantidad"
            formato={formatoCantidad}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Indicador
            titulo="Neto cotizado"
            reporte={reporte}
            campo="neto"
            formato={pesos.format}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GraficoNeto
            titulo="Neto por vendedor"
            datos={reporte.actual.porVendedor}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GraficoNeto
            titulo="Neto por tipo de trabajo"
            datos={reporte.actual.porTipo}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TablaComparativa
            titulo="Por vendedor"
            reporte={reporte}
            clave="porVendedor"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TablaComparativa
            titulo="Por tipo de trabajo"
            reporte={reporte}
            clave="porTipo"
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5">Reporte mensual de cotizaciones</Typography>
          {periodoValido && (
            <Typography color="text.secondary" sx={{ textTransform: "capitalize" }}>
              {nombreDelMes(periodo)}
            </Typography>
          )}
        </Box>
        {selector}
      </Stack>
      {contenido}
    </Box>
  );
};

export default MonthlyReport;
