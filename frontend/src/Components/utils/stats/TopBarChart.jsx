import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Box } from "@mui/material";
import { coloresIntermedios } from "./NewRadialBar";
import { ToolTipNice } from "./ToolTipNice";
import { Title } from "./Title";

const TopBarChart = (props) => {
  const rank = props.rank || 10;
  const data = [...props.data]
    .sort((a, b) => b[props.dataKey.qty] - a[props.dataKey.qty])
    .slice(0, rank);

  const chartHeight = Math.max(300, data.length * 36);

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      {props.title && <Title title={props.title} />}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="1 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey={props.dataKey.cat}
            width={props.labelWidth || 220}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<ToolTipNice />} />
          <Bar dataKey={props.dataKey.qty} radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={coloresIntermedios[index % coloresIntermedios.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TopBarChart;