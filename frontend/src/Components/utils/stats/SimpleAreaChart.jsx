import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { coloresIntermedios, myWrapperStyle } from "./NewRadialBar";
import { Title } from "./Title";
import { ToolTipNice } from "./ToolTipNice";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default class Example extends PureComponent {
  render() {
    return (
      <>
        {this.props.title && <Title title={this.props.title} />}
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth="300px"
          minHeight="200px"
        >
          <AreaChart
            width={500}
            height={400}
            data={this.props.data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="1 2" />
            <XAxis dataKey={this.props.dataKey[0]} />
            <YAxis />
            <Tooltip content={<ToolTipNice />} />
            {this.props.dataKey.map((line, index) => {
              let myLine;
              if (index > 0) {
                myLine = (
                  <Area
                    key={index + line}
                    type="duotone"
                    dataKey={this.props.dataKey[index]}
                    stroke={coloresIntermedios[index]}
                    fill={"rgba(25, 237, 244, 0.23)"}
                  />
                );
              } else {
                myLine = "";
              }
              return myLine;
            })}
          </AreaChart>
        </ResponsiveContainer>
      </>
    );
  }
}
