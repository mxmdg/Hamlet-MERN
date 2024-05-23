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

import { coloresIntermedios, myWrapperStyle } from "./NewRadialBar";

import { convertirFecha } from "../generalData/fechaDiccionario";
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import FullJobsRender from "../../Pages/FullJobsRender";
import { Modal, Box } from "@mui/material";

const NewStackedBarChart = (props) => {

  const [jobsForDay, setJobsForDay] = React.useState(null)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBarClick = async (barData) => {
    // barData podría contener la fecha de la barra clickeada
    const startDate = convertirFecha(barData);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (1/2)); // Para obtener los trabajos de un día específico

    const formattedStartDate = startDate;
    const formattedEndDate = endDate.toISOString();

    setJobsForDay(`jobs/urg?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
    handleOpen()

    // Usando el custom hook para hacer la consulta
    /* const jobs = await getPrivateElements(
      `jobs/urg?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    // Ahora puedes usar 'jobs' para mostrarlos en tu componente

    console.table(jobs); */
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%" minWidth={"300px"}>
      <BarChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend
          iconSize={10}
          iconType="circle"
          verticalAlign="bottom"
          layout="vertical"
          wrapperStyle={myWrapperStyle}
        />
        {props.dataKey.map((item, index) => {
          return (
            <Bar
              dataKey={item}
              stackId="a"
              fill={coloresIntermedios[index]}
              onClick={(e) => handleBarClick(e.payload.name)}
            />
          );
        })}
      </BarChart>      
    </ResponsiveContainer>
    {
      jobsForDay !== null && 
        <Modal open={open} onClose={handleClose}>
          <Box>
            <FullJobsRender 
            route={jobsForDay}
            settings={{ title: "Pedidos", column: "emited", order: "asc" }}
            />
          </Box>
        </Modal>
    }
    </>
    
  );
};

export default NewStackedBarChart;
