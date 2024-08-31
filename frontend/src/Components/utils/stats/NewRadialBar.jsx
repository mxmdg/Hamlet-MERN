import { Backdrop, Typography } from "@mui/material";
import { borderRadius, fontSize, margin, textAlign } from "@mui/system";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const myWrapperStyle = {
  bottom: "0",
  left: "5%",
  width: "90%",
  lineHeight: "1.5em",
  fontSize: "1.1em",
  textAlign: "left",
  fontWeight: "800",
  padding: "15px",
  borderTop: "1px solid #666",
};

export const coloresPasteles = [
  "#FFD1DC", // Rosa pastel
  "#AEC6CF", // Azul cielo
  "#F0E68C", // Amarillo pastel
  "#98FB98", // Verde menta
  "#FFA07A", // Salmón claro
  "#D8BFD8", // Lavanda
  "#FFDAB9", // Melocotón claro
  "#B0C4DE", // Azul perla
  "#FFE4E1", // Rosa suave
  "#87CEEB", // Azul cielo claro
];

export const coloresSaturados = [
  "#FF6EB4", // Rosa brillante
  "#3CB371", // Verde esmeralda
  "#FFD700", // Amarillo brillante
  "#FF6347", // Rojo coral
  "#9370DB", // Púrpura medio
  "#00BFFF", // Azul turquesa
  "#FF8C00", // Naranja oscuro
  "#8A2BE2", // Azul violeta
  "#FFA500", // Naranja
  "#00FF7F", // Verde primavera
];

export const coloresIntermedios = [
  "#FF91A4", // Rosa medio
  "#70DB93", // Verde menta medio
  "#EEC933", // Amarillo medio
  "#FF826B", // Rojo coral medio
  "#B19CD9", // Púrpura lavanda
  "#5F9EA0", // Azul grisáceo
  "#FFB366", // Naranja medio
  "#8470FF", // Azul pálido
  "#FFB6C1", // Rosa claro
  "#8FBC8F", // Verde mar medio
];

export default function NewRadialBar(props) {
  for (let i = 0; i < props.data.length; i++) {
    let resto = (i + 10) % 10;
    props.data[i].fill = coloresIntermedios[resto];
  }

  return (
    <ResponsiveContainer
      maxHeight="900px"
      minHeight="200px"
      minWidth={200}
      width={"90%"}
      height={"100%"}
    > 
      <RadialBarChart
        cx="50%"
        cy="30%"
        innerRadius="20%"
        outerRadius="80%"
        barSize={10}
        data={props.data}
      >
          <Typography>Titulo</Typography>
          <RadialBar
            minAngle={15}
            label={{ position: "outsideStart", fill: "#000" }}
            background="#ffffff88"
            conunterClockWise
            dataKey={props.dataKey}
          />
          <Legend
            iconSize={10}
            iconType="star"
            layout="vertical"
            verticalAlign="top"
            wrapperStyle={myWrapperStyle}
          />
          <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
