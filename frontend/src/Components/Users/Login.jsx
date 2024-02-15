import React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "@mui/material/Input";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import { serverURL, databaseURL } from "../Config/config";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Profile } from "./Profile";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const [error, setError] = React.useState("");
  const [showForgotPasswordForm, setShowForgotPasswordForm] =
    React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  const navigate = useNavigate();
  const context = useContext(AuthContext);
  //const params = useParams();

  const resetError = () => {
    console.log("reset error");
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      const token = await axios.post(databaseURL + "users/login", data);
      console.log(token);
      if (token.data.message) {
        setError({
          message: token.data.message,
          severity: "warning",
          action: { resetError },
        });
      } else {
        context.handleLogin(token.data.token, token.data.expirationTime);
        context.setUserLogged(token.data.document);
        localStorage.setItem("user", JSON.stringify(token.data.document));
        setError({
          message: "Login exitoso",
          severity: "success",
          action: { resetError },
        });
      }
    } catch (e) {
      setError({
        message: "Fallo el login: " + e,
        action: { resetError },
        severity: "error",
      });
    }
  };

  const forgottenPassword = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/hamlet/users/forgot-password",
        data
      );
      setSuccessMessage(response.data.message);
    } catch (e) {
      console.log(e);
      setError({
        message:
          "Error al enviar el correo electrónico de recuperación de contraseña",
        severity: "warning",
        action: { resetError },
      });
    }
  };

  React.useEffect(() => {}, [setError]);

  const errorRender = (
    <ErrorMessage
      message={error.message}
      severity={error.severity}
      action={resetError}
    />
  );

  const success = (
    <Box>
      <Card elevation={2}>
        {context.userLogged === null && <CardHeader title="Login"></CardHeader>}
        {context.userLogged !== null && (
          <CardHeader
            title={`Bienvenido ${context.userLogged.Name}`}
          ></CardHeader>
        )}
        <CardContent>
          {context.userLogged !== null && (
            <Profile />
          )}
          {context.userLogged === null && (
            <FormControl sx={{ width: "90%" }}>
              <form name="Register" onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 3, md: 5 }}
                  columns={{ xs: 1, sm: 4, md: 12 }}
                >
                  <Grid item xs={6} sm={6} md={6}>
                    <TextField
                      id="email"
                      label="email"
                      variant="filled"
                      defaultValue={""}
                      name="email"
                      {...register("email", {
                        required: true,
                        minLength: 3,
                        maxLength: 40,
                      })}
                      onBlur={() => {
                        trigger("email");
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <TextField
                      id="password"
                      label="password"
                      variant="filled"
                      defaultValue={""}
                      type="password"
                      name="password"
                      {...register("password", {
                        required: true,
                        minLength: 3,
                        maxLength: 40,
                      })}
                      onBlur={() => {
                        trigger("password");
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} sx={{ alignSelf: "left" }}>
                    <Button type="submit" variant="contained" color="secondary">
                      Ingresar
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} sx={{ alignSelf: "left" }}>
                    <Button
                      color="secondary"
                      onClick={() => setShowForgotPasswordForm(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </Grid>
                </Grid>
                {error !== "" && (
                  <Grid item xs={6} sm={2} md={9} sx={{ alignSelf: "right" }}>
                    <ErrorMessage
                      message={error.message}
                      severity={error.severity}
                      action={resetError}
                    />
                  </Grid>
                )}
              </form>
            </FormControl>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const ForgotPassword = (
    <FormControl sx={{ width: "90%" }}>
      <form onSubmit={handleSubmit(forgottenPassword)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="email"
              label="Correo Electrónico"
              variant="outlined"
              type="email"
              {...register("email", {
                required: "Este campo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              })}
            />
            {errors.email && (
              <FormHelperText>{errors.email.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Enviar Correo de Recuperación
            </Button>
            <Button
              onClick={() => setShowForgotPasswordForm(false)}
              variant="text"
              color="secondary"
            >
              Volver al Login
            </Button>
          </Grid>
        </Grid>
        {error && (
          <ErrorMessage
            message={error.message}
            severity="warning"
            action={resetError}
          />
        )}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </FormControl>
  );

  return showForgotPasswordForm ? ForgotPassword : success;
};
