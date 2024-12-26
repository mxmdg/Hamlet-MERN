import React, { useState, useEffect } from "react";
import axios from "axios";
import PrinterDetails from "./PrinterDetails";
import PrintersDataForm from "../Formulario/PrintersDataForm";
import Spinner from "../General/Spinner";
import { serverURL } from "../Config/config";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  Card,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
} from "@mui/material";

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

  const getMonthForPeriod = (periodOffset) => {
    const currentDate = new Date();
    const adjustedDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - periodOffset)
    );
    const month = adjustedDate.toLocaleString("default", { month: "long" });
    return month;
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
    <Grid container spacing={3}>
      <Grid xs={12} md={12} key={"totalPrints"}>
        <Card elevation={10} sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {`Impresiones del periodo ${previousMonth}/${currentMonth}`}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={handleIncrement}
                disabled={usePeriod >= maxPeriods}
                sx={{ mr: 1 }}
              >
                Anterior
              </Button>
              <Button
                variant="outlined"
                onClick={handleDecrement}
                disabled={usePeriod === 1}
              >
                Siguiente
              </Button>
            </Box>
          </Box>
          <List>
            <ListItem divider={true}>
              <ListItemText primary={useTotals.color} secondary="Color:" />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary={useTotals.blackHQ}
                secondary="Total Blanco y negro Alta Calidad:"
              />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary={useTotals.large}
                secondary="Total blanco y negro Grandes:"
              />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary={useTotals.small}
                secondary="Total blanco y negro Chicas:"
              />
            </ListItem>
          </List>
        </Card>
      </Grid>

      {loading ? (
        <Spinner color="warning" />
      ) : (
        printerList.map((printer) => (
          <Grid xs={12} md={6} lg={4} key={printer._id}>
            <Card elevation={10} sx={{ p: 2 }}>
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
