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

import { ToolTipNice } from "./ToolTipNice";

import { Title } from "./Title";

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/p/sandbox/simple-radar-chart-2p5sxm";

  render() {
    return (
      <>
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
              stroke="rgb(157, 1, 177)"
              fill="rgba(255, 15, 215, 0.27)"
              fillOpacity={1}
            />
            <Tooltip content={<ToolTipNice />} />
          </RadarChart>
        </ResponsiveContainer>
      </>
    );
  }
}
