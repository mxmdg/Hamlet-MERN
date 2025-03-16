import React from "react";
import {
  Modal,
  Box,
  TextField,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";

export const Title = (props) => {
  return (
    <CardHeader
      title={props.title}
      titleTypographyProps={{ color: "primary" }}
    />
  );
};
