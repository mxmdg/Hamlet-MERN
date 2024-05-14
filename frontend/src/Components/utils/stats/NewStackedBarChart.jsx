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

const NewStackedBarChart = (props) => {
  return (
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
            <Bar dataKey={item} stackId="a" fill={coloresIntermedios[index]} />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NewStackedBarChart;
