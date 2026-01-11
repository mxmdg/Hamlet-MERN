import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ToolTipNice } from "./ToolTipNice";

import {
  coloresSaturados,
  coloresPasteles,
  coloresIntermedios,
  vibrantColors,
  myWrapperStyle,
} from "./NewRadialBar";

import {
  convertirFecha,
  calculateDaysBetweenDates,
} from "../generalData/fechaDiccionario";
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import FullJobsRender from "../../Pages/FullJobsRender";
import {
  Modal,
  Box,
  TextField,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  FormGroup,
  Grid,
} from "@mui/material";
import { Title } from "./Title";

const NewStackedBarChart = (props) => {
  const [jobsForDay, setJobsForDay] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState(null);
  const [statsData, setStatsData] = React.useState(props.data);
  const [dataCount, setDataCount] = React.useState(null);
  const [useTitle, setTitle] = React.useState(props?.title || "Estadisticas");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const calculateAverage = (data) => {
    if (data.length === 0) return 0;
    const total = {};
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "name") {
          total[key] = total[key] ? total[key] + item[key] : item[key];
        }
      });
    });

    const average = {};
    Object.keys(total).forEach((key) => {
      average[key] = Math.ceil(total[key] / data.length);
    });
    return { total, average };
  };

  const handleBarClick = async (barData) => {
    // barData podría contener la fecha de la barra clickeada
    const startDate = convertirFecha(barData);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1 / 2); // Para obtener los trabajos de un día específico

    const formattedStartDate = startDate;
    const formattedEndDate = endDate.toISOString();

    const weekdays = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ];

    setJobsForDay(
      `jobs/urg?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    setTitle(
      `${weekdays[endDate.getDay()]} ${endDate.getDate() + 1}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`
    );
    handleOpen();
  };

  React.useEffect(() => {
    setDataCount(calculateAverage(props.data));
    function filtrarTipoTrabajo(data, tipoTrabajo) {
      return data.map((item) => {
        const { name } = item;
        const tipo = item[tipoTrabajo];

        return tipo !== undefined ? { name, [tipoTrabajo]: tipo } : { name };
      });
    }

    if (filter !== null) {
      setStatsData(filtrarTipoTrabajo(props.data, filter));
    } else {
      setStatsData(props.data);
    }
  }, [filter]);

  return (
    <>
      {props.title && <Title title={props.title} />}
      <FormGroup>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} textAlign={"right"}>
            <TextField
              type="date"
              label="Desde"
              variant="standard"
              size="small"
              color="secondary"
              InputLabelProps={{
                shrink: true, // Ensures the label stays above the input
              }}
              onChange={(e) => {
                props.selectFrom(
                  calculateDaysBetweenDates(e.target.value, Date())
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Hasta"
              variant="standard"
              size="small"
              color="secondary"
              InputLabelProps={{
                shrink: true, // Ensures the label stays above the input
              }}
              onChange={(e) => {
                props.selectTo(
                  calculateDaysBetweenDates(Date(), e.target.value)
                );
              }}
            />
          </Grid>
        </Grid>
      </FormGroup>
      <Box sx={{ width: "100%", minWidth: 0 }}>
        <ResponsiveContainer height={300}>
          <BarChart
            data={statsData}
            barCategoryGap={2}
            reverseStackOrder={true}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ToolTipNice />} />

            <Legend
              iconSize={10}
              iconType={(e) => {
                return filter === e.dataKey ? "circle" : "square";
              }}
              verticalAlign="bottom"
              layout="vertical"
              wrapperStyle={myWrapperStyle}
              onClick={(e) => {
                setFilter(filter !== e.dataKey ? e.dataKey : null);
              }}
              formatter={(value, entry) => {
                // entry.dataKey contiene la clave real del dataset
                const key = entry && entry.dataKey ? entry.dataKey : value;
                if (!dataCount || !dataCount.total || !dataCount.average)
                  return value;
                const total =
                  dataCount.total[key] !== undefined ? dataCount.total[key] : 0;
                const avg =
                  dataCount.average[key] !== undefined
                    ? dataCount.average[key]
                    : 0;
                const fmt = (n) =>
                  typeof n === "number" ? n.toLocaleString("es-ES") : n;
                return `${value} (T: ${fmt(total)} / P: ${fmt(avg)})`;
              }}
            />
            {props.dataKey.map((item, index) => {
              return (
                <Bar
                  dataKey={item}
                  key={index}
                  stackId="b"
                  fill={coloresIntermedios[index + 1]}
                  onClick={(e) => handleBarClick(e.payload.name)}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {jobsForDay !== null && (
        <Modal open={open} onClose={handleClose}>
          <Box>
            <FullJobsRender
              route={jobsForDay}
              settings={{
                title: `Pedidos para el ${useTitle}`,
                column: "emited",
                order: "asc",
                filter: filter,
              }}
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default NewStackedBarChart;
