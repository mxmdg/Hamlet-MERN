import React, { useState, useEffect } from "react";
import axios from "axios";
import PrinterDetails from "./PrinterDetails";
import PrintersDataForm from "../Formulario/PrintersDataForm";
import Spinner from "../General/Spinner";
import { serverURL } from "../Config/config";
import { spanishFormat } from "../utils/generalData/numbersAndCurrencies";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  Card,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
  Divider,
  CardActions,
  ButtonGroup,
} from "@mui/material";
// Agregamos imports de recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToolTipNice } from "../utils/stats/ToolTipNice";
import {
  coloresIntermedios,
  coloresSaturados,
  coloresPasteles,
  myWrapperStyle,
} from "../utils/stats/NewRadialBar";

const readPrinters = async () => {
  const res = await axios.get(`${serverURL}/hamlet/impresoras`);
  return res.data;
};

const Printers = (props) => {
  const [printerList, setPrinterList] = useState([]);
  const [useEdit, setEdit] = useState("");
  const [loading, setLoading] = useState(true);
  const [useTotals, setTotals] = useState({
    color: 0,
    large: 0,
    small: 0,
    blackHQ: 0,
  });
  const [usePeriod, setPeriod] = useState(1);
  const [maxPeriods, setMaxPeriods] = useState(1);
  const [chartData, setChartData] = useState([]);

  const getMonthForPeriod = (periodOffset) => {
    const currentDate = new Date();
    const adjustedDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - periodOffset)
    );
    const month = adjustedDate.toLocaleString("default", { month: "long" });
    const year = adjustedDate.getFullYear();
    return `${month} ${year}`;
  };

  const cardStyle = {
    p: 5,
    borderRadius: 1,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const printers = await readPrinters();
        setPrinterList(printers);
        setEdit(false);
        setLoading(false);

        // Calculamos el número máximo de periodos
        const maxLength = Math.max(
          ...printers.map((printer) => printer.Billing.length)
        );
        setMaxPeriods(maxLength);

        // Sumamos totales para el periodo actual
        const totals = { color: 0, large: 0, small: 0, blackHQ: 0 };
        printers.forEach((p) => {
          const periodIndex = p.Billing.length - usePeriod;
          if (periodIndex >= 0) {
            if (p.Colores > 1) {
              totals.color += parseInt(p.Billing[periodIndex].Color || 0, 10);
              totals.blackHQ += parseInt(p.Billing[periodIndex].Black || 0, 10);
            } else if (p.Colores === 1) {
              totals.large += parseInt(p.Billing[periodIndex].Large || 0, 10);
              totals.small += parseInt(p.Billing[periodIndex].Small || 0, 10);
            }
          }
        });
        setTotals(totals);

        // --- Generar datos para el gráfico ---
        // Para cada periodo, sumar los totales de cada tipo
        const periods = [];
        for (let period = 1; period <= maxLength; period++) {
          const periodTotals = { color: 0, large: 0, small: 0, blackHQ: 0 };
          printers.forEach((p) => {
            const periodIndex = p.Billing.length - period;
            if (periodIndex >= 0) {
              if (p.Colores > 1) {
                periodTotals.color += parseInt(
                  p.Billing[periodIndex].Color || 0,
                  10
                );
                periodTotals.blackHQ += parseInt(
                  p.Billing[periodIndex].Black || 0,
                  10
                );
              } else if (p.Colores === 1) {
                periodTotals.large += parseInt(
                  p.Billing[periodIndex].Large || 0,
                  10
                );
                periodTotals.small += parseInt(
                  p.Billing[periodIndex].Small || 0,
                  10
                );
              }
            }
          });
          // Nombre del periodo (mes)
          const date = new Date();
          date.setMonth(date.getMonth() - period);
          const month = date.toLocaleString("default", { month: "short" });
          periods.push({
            name: month,
            ...periodTotals,
          });
        }
        // Ordenar para que el periodo más reciente esté a la derecha
        setChartData(periods.reverse());
        // --- fin gráfico ---
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [useEdit, usePeriod]);

  const handleIncrement = () => {
    if (usePeriod < maxPeriods) {
      setPeriod((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (usePeriod > 1) {
      setPeriod((prev) => prev - 1);
    }
  };

  const previousMonth = getMonthForPeriod(usePeriod);
  const currentMonth = getMonthForPeriod(usePeriod - 1);

  return (
    <Grid
      xs={12}
      sm={12}
      md={12}
      lg={18}
      container
      spacing={5}
      maxWidth={"95%"}
      margin={"auto"}
    >
      {/* Gráfico de barras de totales por periodo */}
      <Grid xs={12} md={9} lg={9} key={"chart"}>
        <Card elevation={10} sx={cardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Totales de impresiones por periodo
          </Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap={2}
                reverseStackOrder={true}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ToolTipNice />} />
                <Legend />
                <Bar dataKey="color" fill={coloresSaturados[1]} name="Color" />
                <Bar
                  dataKey="blackHQ"
                  fill={coloresSaturados[5]}
                  name="Blanco y negro HQ"
                />
                <Bar
                  dataKey="large"
                  fill={coloresSaturados[3]}
                  name="Blanco y negro Grandes"
                />
                <Bar
                  dataKey="small"
                  fill={coloresSaturados[8]}
                  name="Blanco y negro Chicas"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>
      <Grid xs={12} md={3} lg={3} key={"totalPrints"}>
        <Card elevation={10} sx={cardStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {`Impresiones del periodo ${previousMonth}/${currentMonth}`}
            </Typography>
          </Box>
          <List>
            <ListItem divider={true}>
              <ListItemText
                primary={spanishFormat(useTotals.color)}
                secondary="Color:"
              />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary={spanishFormat(useTotals.blackHQ)}
                secondary="Total Blanco y negro Alta Calidad:"
              />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary={spanishFormat(useTotals.large)}
                secondary="Total blanco y negro Grandes:"
              />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary={spanishFormat(useTotals.small)}
                secondary="Total blanco y negro Chicas:"
              />
            </ListItem>
          </List>
          <CardActions>
            <Divider></Divider>
            <ButtonGroup
              variant="contained"
              color="info"
              sx={{ margin: "auto" }}
            >
              <Button
                onClick={handleIncrement}
                disabled={usePeriod >= maxPeriods}
              >
                Anterior
              </Button>
              <Button onClick={handleDecrement} disabled={usePeriod === 1}>
                Siguiente
              </Button>
            </ButtonGroup>
          </CardActions>
        </Card>
      </Grid>

      {loading ? (
        <Spinner color="warning" />
      ) : (
        printerList.map((printer) => (
          <Grid xs={12} sm={6} md={6} lg={3} key={printer._id}>
            <Card elevation={10} sx={cardStyle}>
              <PrinterDetails
                pd={printer}
                id={printer._id}
                collection={props.collection}
                formData={PrintersDataForm}
                editor={setEdit}
              />
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Printers;
