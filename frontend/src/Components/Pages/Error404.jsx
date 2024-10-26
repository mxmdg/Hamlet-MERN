import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { serverURL, databaseURL } from "../Config/config";
import {
  putPrivateElement,
  getPrivateElementByID,
  getPrivateElements,
} from "../customHooks/FetchDataHook";

const Error404 = () => {
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const resetError = () => {
    console.log("reset error");
    setError("");
  };

  return (
    <Box>
      <Card elevation={6}>
        <CardHeader title="Error 404" subheader="No se encuentra la página" />
        <CardContent>
          <Typography variant="button" color="info">
            Nada que ver aquí. Volvé por donde viniste!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Error404;
