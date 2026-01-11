import React, { PureComponent } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Box } from "@mui/material";

import { ToolTipNice } from "./ToolTipNice";

import { Title } from "./Title";

import {
  coloresIntermedios,
  coloresPasteles,
  coloresSaturados,
} from "./NewRadialBar";

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/p/sandbox/simple-radar-chart-2p5sxm";

  render() {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Title title={this.props.title} />
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={"300px"}
          minWidth={"360px"}
        >
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="90%"
            data={this.props.data}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey={this.props.dataKey.cat} />
            <PolarRadiusAxis />
            <Radar
              name="Trabajos"
              dataKey={this.props.dataKey.qty}
              stroke="#25fb9eff"
              fill="#25fba992"
              fillOpacity={1}
            />
            <Tooltip content={<ToolTipNice />} />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
