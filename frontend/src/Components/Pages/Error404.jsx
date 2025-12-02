import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { ReactComponent as Logo } from "../../../src/img/Logo/logo ok-05.svg";
import { serverURL, databaseURL } from "../Config/config";
import {
  putPrivateElement,
  getPrivateElementByID,
  getPrivateElements,
} from "../customHooks/FetchDataHook";

const Error404 = () => {
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const resetError = () => {
    navigate("/");
  };

  return (
    <Box>
      <Card elevation={6}>
        <CardHeader title="Error 404" subheader="No se encuentra la página" />
        <CardContent>
          <ErrorMessage
            title="Página no encontrada"
            severity="warning"
            message={`Lo sentimos mucho ${
              user ? user.Name : ""
            }, la página que estás buscando no existe o ha sido movida.`}
            action={resetError}
            buttonTxt="Volver al inicio"
          />
          <Logo onClick={resetError} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Error404;
