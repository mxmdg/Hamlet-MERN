import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  CartesianGrid,
  Legend,
} from "recharts";

const handleDate = (date) => {
  const fecha = new Date(date);
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  const formattedDate = fecha.toLocaleDateString("es-ES", options);
  return formattedDate;
};

export default function MyLineChart(props) {
  console.log(props.data);

  const valorMillar = (data) => {
    const newData = [];
    for (let item of data) {
      const newItem = { ...item };
      newItem.Valor = item.Valor * 1000;
      newData.push(newItem);
    }
    return newData;
  };

  const newData = valorMillar(props.data);

  console.log(props.newData);

  const chart = (interval) => (
    <ResponsiveContainer height={250} width="100%">
      <LineChart data={newData} margin={{ right: 25, top: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="" interval={handleDate(interval)} />
        <YAxis type="number" />
        <Line
          type="linear"
          dataKey="Valor"
          stroke="#69a"
          activeDot={{ r: 8 }}
        />
        <Line
          type="linear"
          dataKey="Entrada"
          stroke="#96a"
          activeDot={{ r: 4 }}
        />
        <Line
          type="linear"
          dataKey="Minimo"
          stroke="#a96"
          activeDot={{ r: 2 }}
        />
        <Label />
        <Tooltip
          animationDuration={750}
          animationEasing="ease-out"
          contentStyle={{
            background: "#fff",
            backdropFilter: "blur(5px)",
            borderRadius: "5px",
            boxShadow: "7px 7px 10px #000000aa",
            border: "1px solid #39e",
            padding: "15px",
          }}
          viewBox={{ x: 0, y: 0, width: 250, height: 600 }}
          allowEscapeViewBox={{ x: false, y: true }}
        />
        <Legend verticalAlign="top" height={36} />
      </LineChart>
    </ResponsiveContainer>
  );

  return <>{chart("equidistantPreserveStart")}</>;
}
