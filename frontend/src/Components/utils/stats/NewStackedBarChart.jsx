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

import { convertirFecha } from "../generalData/fechaDiccionario";
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
} from "@mui/material";
import { Title } from "./Title";

const NewStackedBarChart = (props) => {
  const [jobsForDay, setJobsForDay] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState(null);
  const [statsData, setStatsData] = React.useState(props.data);
  const [useTitle, setTitle] = React.useState(props?.title || "Estadisticas");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

    // Usando el custom hook para hacer la consulta
    /* const jobs = await getPrivateElements(
      `jobs/urg?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    // Ahora puedes usar 'jobs' para mostrarlos en tu componente

    console.table(jobs); */
  };

  React.useEffect(() => {
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
      <ResponsiveContainer
        maxHeight="900px"
        minHeight="300px"
        minWidth={200}
        width={"90%"}
        height={"100%"}
      >
        <BarChart
          width={500}
          height={400}
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
