
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
  Legend
} from "recharts";

const handleDate = (date)=> {
    const fecha = new Date(date)
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = fecha.toLocaleDateString('es-ES', options);
    return formattedDate
 }

export default function MyLineChart(props) {
    const data = props.data

    console.log(data)

  const chart = (interval) => (
    <ResponsiveContainer height={250} width="100%">
      <LineChart data={data} margin={{ right: 25, top: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Fecha" interval={interval} />
        <YAxis interval={interval} />
        <Line
          type="monotone"
          dataKey="Valor"
          stroke="#337598"
          activeDot={{ r: 4 }}
        />
        <Line type="monotone" dataKey="Entrada" stroke="#982489" activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="Minimo" stroke="#979723" activeDot={{ r: 4 }}/>
        <Label/>
        <Tooltip/>
        <Legend/>
      </LineChart >
    </ResponsiveContainer>
  );

  return (
    <>
      {chart("equidistantPreserveStart")}
    </>
  );
}
