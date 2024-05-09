
import React from "react";
import { RadialBarChart, RadialBar, Legend } from "recharts";

const data = [
  {
    name: "18-24",
    uv: 31.47,
    pv: 2400,
    fill: "#8884d8"
  },
  {
    name: "25-29",
    uv: 26.69,
    pv: 4567,
    fill: "#83a6ed"
  },
  {
    name: "30-34",
    uv: 15.69,
    pv: 1398,
    fill: "#8dd1e1"
  },
  {
    name: "35-39",
    uv: 8.22,
    pv: 9800,
    fill: "#82ca9d"
  },
  {
    name: "40-49",
    uv: 8.63,
    pv: 3908,
    fill: "#a4de6c"
  },
  {
    name: "50+",
    uv: 2.63,
    pv: 4800,
    fill: "#d0ed57"
  },
  {
    name: "unknow",
    uv: 6.67,
    pv: 4800,
    fill: "#ffc658"
  }
];

const style = {
  top: 0,
  left: '90%',
  lineHeight: "24px",
};

const coloresPasteles = [
    "#FFD1DC", // Rosa pastel
    "#AEC6CF", // Azul cielo
    "#F0E68C", // Amarillo pastel
    "#98FB98", // Verde menta
    "#FFA07A", // Salmón claro
    "#D8BFD8", // Lavanda
    "#FFDAB9", // Melocotón claro
    "#B0C4DE", // Azul perla
    "#FFE4E1", // Rosa suave
    "#87CEEB"  // Azul cielo claro
  ];

  const coloresSaturados = [
    "#FF6EB4", // Rosa brillante
    "#3CB371", // Verde esmeralda
    "#FFD700", // Amarillo brillante
    "#FF6347", // Rojo coral
    "#9370DB", // Púrpura medio
    "#00BFFF", // Azul turquesa
    "#FF8C00", // Naranja oscuro
    "#8A2BE2", // Azul violeta
    "#FFA500", // Naranja
    "#00FF7F"  // Verde primavera
  ];


const coloresIntermedios = [
  "#FF91A4", // Rosa medio
  "#70DB93", // Verde menta medio
  "#FFD966", // Amarillo medio
  "#FF826B", // Rojo coral medio
  "#B19CD9", // Púrpura lavanda
  "#5F9EA0", // Azul grisáceo
  "#FFB366", // Naranja medio
  "#8470FF", // Azul pálido
  "#FFB6C1", // Rosa claro
  "#8FBC8F"  // Verde mar medio
];

export default function NewRadialBar(props) {

    for (let i = 0; i < props.data.length; i++) {
        let resto = (i + 10) % 10
        props.data[i].fill = coloresIntermedios[resto]
    }

  return (
    <RadialBarChart
      width={500}
      height={300}
      cx={150}
      cy={150}
      innerRadius={20}
      outerRadius={150}
      barSize={20}
      data={props.data}
    >
      <RadialBar
        minAngle={15}
        label={{ position: "insideStart", fill: "#fff" }}
        background
        clockWise
        dataKey={props.dataKey}
        legendType="circle"
      />
      <Legend
        width={200}
        iconSize={15}
        layout="vertical"
        align="right"
        verticalAlign="bottom"
        wrapperStyle={style}
      />
    </RadialBarChart>
  );
}
