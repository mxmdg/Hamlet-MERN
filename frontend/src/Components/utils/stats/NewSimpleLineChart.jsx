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
import {
  Modal,
  Box,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";

import { coloresIntermedios, myWrapperStyle } from "./NewRadialBar";
import { ToolTipNice } from "./ToolTipNice";
import { handleDate, procesarFechaISO } from "../generalData/fechaDiccionario";
import { Title } from "./Title";

export const NewSimpleLineChart = (props) => {
  const myDataKey = [];

  for (let date of props.data) {
    console.log(date);
    const formatedDate = procesarFechaISO(date.Fecha);
    console.log(formatedDate);
    myDataKey.push(formatedDate);
  }

  return (
    <>
      {props.title && <Title title={props.title} />}
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth="300px"
        minHeight="300px"
      >
        <LineChart
          width={"100%"}
          height={"100%"}
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
          <Tooltip content={<ToolTipNice />} />
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
                  key={index + line}
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
    </>
  );
};
