import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Paper,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { HAMLET_API, serverURL, url } from "../Config/config";
import axios from "axios";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Obtiene el token de la URL
  const navigate = useNavigate(); // Cambiar a useNavigate

  const resetError = () => {
    setError("");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(token);
    data.token = token;
    try {
      // Hacer la solicitud para restablecer la contraseña
      const response = await axios.put(
        `${HAMLET_API}users/resetPassword/${token}`,
        data
      );
      setSuccessMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      setError({
        msg:
          "Hubo un error al restablecer la contraseña: " +
          error.response.data.message,
        sev: "error",
        act: resetError,
      });

      setLoading(false);
    }
  };

  return (
    <Paper>
      <Card elevation={6}>
        <CardHeader title="Restablecer Contraseña" />
        <CardContent>
          {!loading && (
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
                  title="Revisa los datos"
                  message={error.msg}
                  severity={error.sev}
                  action={error.act}
                  buttonTxt="Reintentar"
                />
              )}
              {successMessage && (
                <ErrorMessage
                  title="Felicidades, has cambiado tu contraseña"
                  message={successMessage}
                  severity={"success"}
                  action={() => navigate("/login")} // Usar navigate aquí
                  buttonTxt={"Ir a Login"}
                />
              )}
              <Button type="submit" variant="contained" color="primary">
                Restablecer Contraseña
              </Button>
            </form>
          )}
          {loading && (
            <ErrorMessage
              message={"Restableciendo contraseña... Por favor, espere."}
              severity="info"
              action={() => setLoading(false)}
            />
          )}
        </CardContent>
      </Card>
    </Paper>
  );
};

export default ResetPassword;
