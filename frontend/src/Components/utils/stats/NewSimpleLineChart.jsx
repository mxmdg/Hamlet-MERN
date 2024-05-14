import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { coloresIntermedios, myWrapperStyle } from "./NewRadialBar";

export const NewSimpleLineChart = (props) => {
  return (
    <ResponsiveContainer width="98%" height="100%" minWidth={"300px"}>
      <LineChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={props.dataKey[0]} />
        <YAxis />
        <Tooltip />
        <Legend
          iconSize={10}
          iconType="circle"
          verticalAlign="bottom"
          layout="vertical"
          wrapperStyle={myWrapperStyle}
        />
        <Line
          type="monotone"
          dataKey={props.dataKey[1]}
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey={props.dataKey[2]} stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};
