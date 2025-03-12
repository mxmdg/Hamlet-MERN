import React, { PureComponent } from "react";

import {
  Modal,
  Box,
  Divider,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";

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

export const ToolTipNice = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card elevation={12} variant="elevation">
        <CardHeader subheader={label} />
        <Divider />
        <CardContent>
          {payload.map((item, index) => {
            return (
              <Typography color="primary" key={index + item.name} variant="h6">
                {item.name}: <b>{item.value}</b>
              </Typography>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return null;
};
