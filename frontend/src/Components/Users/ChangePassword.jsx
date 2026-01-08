import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { serverURL, databaseURL } from "../Config/config";
import {
  putPrivateElement,
  getPrivateElementByID,
  getPrivateElements,
} from "../customHooks/FetchDataHook";

const ChangePassword = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(user);

  const resetError = () => {
    console.log("reset error");
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      // Hacer la solicitud para cambiar la contraseña
      if (user) {
        const response = await putPrivateElement(
          `${serverURL}/hamlet/users/${user._id}/change-password`,
          data
        );
        console.log("Respuesta al cambiar contraseña: " + response.data);
      }

      // Manejar la respuesta
      setError({
        title: "Contraseña Cambiada",
        msg: "La contraseña fue cambiada exitosamente",
        sev: "success",
        act: resetError,
      });
      // Por ejemplo, mostrar un mensaje de éxito o redireccionar a otra página
    } catch (error) {
      setError({
        title: "No se pudo cambiar la contraseña",
        msg:
          "Hubo un error al cambiar la contraseña, " +
          error.response.data.message,
        sev: "error",
        act: resetError,
      });
    }
  };

  return (
    <Box>
      <Card elevation={1}>
        <CardHeader
          title="Cambiar Contraseña"
          titleTypographyProps={{ color: props.color }}
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Contraseña Actual"
              type="password"
              {...register("oldPassword", { required: true })}
              error={!!errors.oldPassword}
              helperText={
                errors.oldPassword ? "La contraseña actual es requerida" : ""
              }
              fullWidth
              margin="normal"
              variant={props.variant}
              color={props.color}
            />
            <TextField
              label="Nueva Contraseña"
              type="password"
              {...register("newPassword", { required: true })}
              error={!!errors.newPassword}
              helperText={
                errors.newPassword ? "La nueva contraseña es requerida" : ""
              }
              fullWidth
              margin="normal"
              variant={props.variant}
              color={props.color}
            />
            <TextField
              label="Confirmar Nueva Contraseña"
              type="password"
              {...register("confirmNewPassword", { required: true })}
              error={!!errors.confirmNewPassword}
              helperText={
                errors.confirmNewPassword
                  ? "La confirmación de la nueva contraseña es requerida"
                  : ""
              }
              fullWidth
              margin="normal"
              variant={props.variant}
              color={props.color}
            />
            {error && (
              <ErrorMessage
                title={error.title}
                message={error.msg}
                severity={error.sev}
                action={error.act}
              />
            )}
            <Button type="submit" variant={props.variant} color={props.color}>
              Cambiar Contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;
