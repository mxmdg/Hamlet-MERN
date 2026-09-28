import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import TopBarChart from "../utils/stats/TopBarChart";
import {Title} from "../utils/stats/Title";

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

// Mismo estilo que los paneles de StatsCollector
const panelSx = {
  borderRadius: 1,
  height: "100%",
  boxShadow: 10,
  p: 2,
  overflow: "hidden",
};

// minWidth: 0 deja que el ítem del Grid se achique aunque adentro haya un
// gráfico o una tabla ancha (sin esto, flexbox no lo achica y empuja la página)
const itemSx = { minWidth: 0 };

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
    <Title title={titulo} />
    <Typography
      variant="h4"
      sx={{ mb: 1, fontSize: { xs: "1.6rem", sm: "2.125rem" } }}
    >
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
      <Title title={titulo} />
      {filas.length === 0 ? (
        <Typography color="text.secondary">Sin cotizaciones</Typography>
      ) : (
        <TableContainer sx={{ overflowX: "auto", maxWidth: "100%" }}>
          <Table size="small" sx={{ minWidth: 520, "& td, & th": { whiteSpace: "nowrap" } }}>
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

const GraficoNeto = ({ titulo, datos, labelWidth }) => (
  <Paper elevation={2} sx={panelSx}>
    {datos.length === 0 ? (
      <>
        <Title title={titulo} />
        <Typography color="text.secondary">Sin cotizaciones</Typography>
      </>
    ) : (
      <TopBarChart
        title={titulo}
        data={datos}
        dataKey={{ cat: "nombre", qty: "neto" }}
        labelWidth={labelWidth}
      />
    )}
  </Paper>
);

const MonthlyReport = () => {
  const { periodo: periodoURL } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const esCelular = useMediaQuery(theme.breakpoints.down("sm"));
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
      variant="standard"
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
      <Grid size={12}>
        <Typography color="error">
          El período "{periodo}" no es válido. Elegí un mes en el selector.
        </Typography>
      </Grid>
    );
  } else if (loading) {
    contenido = (
      <Grid size={12}>
        <Spinner title={`Cargando reporte`} color={"primary"} />
      </Grid>
    );
  } else if (useError) {
    contenido = (
      <Grid size={12}>
        <ErrorMessage
          title={"Error cargando el reporte"}
          message={
            useError?.response?.data?.message ||
            useError?.message ||
            "Error desconocido"
          }
        action={clearError}
        />
      </Grid>
    );
  } else if (reporte) {
    contenido = (
      <>
        <Grid size={{ xs: 12, sm: 6 }} sx={itemSx}>
          <Indicador
            titulo="Cotizaciones"
            reporte={reporte}
            campo="cantidad"
            formato={formatoCantidad}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={itemSx}>
          <Indicador
            titulo="Neto cotizado"
            reporte={reporte}
            campo="neto"
            formato={pesos.format}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={itemSx}>
          <GraficoNeto
            titulo="Neto por vendedor"
            datos={reporte.actual.porVendedor}
            labelWidth={esCelular ? 100 : 180}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={itemSx}>
          <GraficoNeto
            titulo="Neto por tipo de trabajo"
            datos={reporte.actual.porTipo}
            labelWidth={esCelular ? 100 : 180}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={itemSx}>
          <TablaComparativa
            titulo="Por vendedor"
            reporte={reporte}
            clave="porVendedor"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={itemSx}>
          <TablaComparativa
            titulo="Por tipo de trabajo"
            reporte={reporte}
            clave="porTipo"
          />
        </Grid>
      </>
    );
  }

  return (
    <Grid
      sx={{ width: "100%", height: "100%", p: 2 }}
      container
      spacing={{ xs: 0, sm: 1, md: 3 }}
    >
      <Grid size={12} sx={itemSx}>
        <Paper elevation={2} sx={panelSx}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 8 }} sx={itemSx}>
              <Title title="Reporte mensual de cotizaciones" />
              {periodoValido && (
                <Typography
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {nombreDelMes(periodo)}
                </Typography>
              )}
            </Grid>
            <Grid
              size={{ xs: 12, sm: 4 }}
              sx={{ ...itemSx, textAlign: { xs: "left", sm: "right" } }}
            >
              {selector}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {contenido}
    </Grid>
  );
};

export default MonthlyReport;
