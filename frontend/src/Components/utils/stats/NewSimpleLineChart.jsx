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
import { handleDate } from "../generalData/fechaDiccionario";

export const NewSimpleLineChart = (props) => {
  const myDataKey = [];

  for (let date of props.dataKey) {
    const formatedDate = handleDate(date);
    myDataKey.push(formatedDate);
  }

  return (
    <ResponsiveContainer
      width="98%"
      height="100%"
      minWidth={"300px"}
      minHeight={"400px"}
    >
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
        <XAxis dataKey={myDataKey} />
        <YAxis />
        <Tooltip />
        <Legend
          iconSize={10}
          iconType="circle"
          verticalAlign="bottom"
          layout="vertical"
          wrapperStyle={myWrapperStyle}
        />
        {props.dataKey.map((line, index) => {
          let myLine;
          if (index > 0) {
            myLine = (
              <Line
                type="monotone"
                dataKey={props.dataKey[index]}
                stroke={coloresIntermedios[index]}
                activeDot={{ r: 8 }}
              />
            );
          } else {
            myLine = "";
          }
          return myLine;
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};
