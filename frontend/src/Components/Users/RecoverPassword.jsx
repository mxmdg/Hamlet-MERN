import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { databaseURL, serverURL } from "../Config/config";
import axios from "axios";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useParams(); // Obtiene el token de la URL

  const resetError = () => {
    setError("");
  };

  const onSubmit = async (data) => {
    console.log(token);
    data.token = token;
    try {
      // Hacer la solicitud para restablecer la contraseña
      const response = await axios.put(
        `http://192.168.0.198:5000/Hamlet/users/resetPassword/${token}`,
        data
      );
      console.log(response.data);
      setSuccessMessage(response.data.message);
    } catch (error) {
      console.log(error);
      setError({
        msg: "Hubo un error al restablecer la contraseña: " + error.message,
        sev: "error",
        act: resetError,
      });
    }
  };

  return (
    <Box>
      <Card elevation={6}>
        <CardHeader title="Restablecer Contraseña" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Nueva Contraseña"
              type="password"
              {...register("newPassword", { required: true })}
              error={!!errors.newPassword}
              helperText={
                errors.newPassword && "La nueva contraseña es requerida"
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirmar Nueva Contraseña"
              type="password"
              {...register("confirmNewPassword", { required: true })}
              error={!!errors.confirmNewPassword}
              helperText={
                errors.confirmNewPassword &&
                "Por favor, confirme la nueva contraseña"
              }
              fullWidth
              margin="normal"
            />
            {error && (
              <ErrorMessage
                message={error.msg}
                severity={error.sev}
                action={error.act}
              />
            )}
            {successMessage && <p>{successMessage}</p>}
            <Button type="submit" variant="contained" color="primary">
              Restablecer Contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
