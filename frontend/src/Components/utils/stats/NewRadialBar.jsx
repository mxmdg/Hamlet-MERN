import { Backdrop, Typography } from "@mui/material";
import { borderRadius, fontSize, height, margin, textAlign } from "@mui/system";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ToolTipNice } from "./ToolTipNice";
import { Title } from "./Title";
import { Box } from "@mui/material";

export const myWrapperStyle = {
  bottom: "0",
  left: "5%",
  width: "90%",
  lineHeight: "1.5em",
  fontSize: "1em",
  textAlign: "left",
  fontWeight: "800",
  padding: "10px",
  borderTop: "1px solid #666",
  columns: "2",
  height: "fit-content",
};

export const myWrapperStyleRight = {
  top: "0",
  left: "75%",
  right: "0",
  width: "25%",
  lineHeight: "1.5em",
  fontSize: "1em",
  textAlign: "left",
  horizontalAlign: "left",
  fontWeight: "800",
  padding: "10px",
  borderLeft: "1px solid #666",
  columns: "1",
  height: "fit-content",
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

export const vibrantColors = [
  "#8bff7e",
  "#fff85d",
  "#670694",
  "#e30168",
  "#ff6256",
  "#99b6ff",
  "#ff99ff",
  "#ffaeb7",
  "#ffdf94",
  "#fbffa1",
];

export default function NewRadialBar(props) {
  for (let i = 0; i < props.data.length; i++) {
    let resto = (i + 10) % 10;
    props.data[i].fill = coloresIntermedios[resto];
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {props.title && <Title title={props.title} />}
      <ResponsiveContainer
        width={"100%"}
        height={"100%"}
        minWidth={150}
        minHeight={300}
      >
        <RadialBarChart
          cx="50%"
          cy="30%"
          innerRadius="5%"
          outerRadius="80%"
          barSize={10}
          data={props.data}
        >
          <RadialBar
            minAngle={5}
            label={{ position: "outside", fill: "#ff0" }}
            background="rgb(248, 35, 35)"
            dataKey={props.dataKey.qty}
          />
          <Legend
            iconSize={7}
            iconType="diamond"
            layout="horizontal"
            align="left"
            verticalAlign="bottom"
            wrapperStyle={myWrapperStyle}
          />
          <Tooltip content={<ToolTipNice />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </Box>
  );
}
