import React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "@mui/material/Input";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
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
import { serverURL, HAMLET_API, url } from "../Config/config";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Profile } from "./Profile";
import Spinner from "../General/Spinner";
import Logo from "../../../src/img/Logo/logo ok-05.svg";
export const Login = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // "onChange"
  });
  const [useColor, setColor] = React.useState(props.color || "primary");
  const [useVariant, setVariant] = React.useState(props.variant || "filled");
  const [error, setError] = React.useState("");
  const [showForgotPasswordForm, setShowForgotPasswordForm] =
    React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  //const params = useParams();

  const resetError = () => {
    setError("");
  };

  const resetSuccess = () => {
    setSuccessMessage("");
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      const token = await axios.post(HAMLET_API + "users/login", data);
      if (token.data.message) {
        setError({
          message: token.data.message,
          severity: "warning",
          action: { resetError },
        });
        setLoading(false);
        return;
      } else {
        context.handleLogin(token.data.token, token.data.expirationTime);
        context.setUserLogged(token.data.document);
        localStorage.setItem("user", JSON.stringify(token.data.document));
        localStorage.setItem(
          "memberships",
          JSON.stringify(token.data.memberships),
        );
        context.setMemberships(token.data.memberships);
        setError({
          message: "Login exitoso",
          severity: "success",
          action: { resetError },
        });
        setLoading(false);
        return;
      }
    } catch (e) {
      setLoading(false);
      setError({
        message: "Fallo el login: " + e,
        action: { resetError },
        severity: "error",
      });
      return;
    }
  };

  const forgottenPassword = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${HAMLET_API}users/forgot-password`,
        data,
      );
      setSuccessMessage({
        message: response.data.message,
        severity: "success",
        action: { resetSuccess },
      });
      setLoading(false);
    } catch (e) {
      setError({
        message: "Error al enviar el correo: " + e.response.data.message,
        severity: "warning",
        action: { resetError },
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {}, [setError]);

  const errorRender = (
    <ErrorMessage
      title="Error"
      message={error.message}
      severity={error.severity}
      action={resetError}
    />
  );

  const loadingRender = (
    <Spinner color="primary" title="Procesando solicitud..." />
  );

  const success = (
    <Container
      height={"auto"} //context.userLogged === null ? "100%" :
      maxWidth={context.userLogged === null ? "sm" : "lg"}
      sx={
        context.userLogged === null
          ? {
              padding: "auto",
              marginTop: "auto",
              marginBottom: "auto",
              alignItems: "center",
            }
          : { padding: "0px", marginTop: "0px", marginBottom: "0px" }
      }
    >
      <Card variant={props.variant}>
        {context.userLogged === null && (
          <CardHeader
            /* avatar={
              <Avatar
                src={Logo}
                alt="Hamlet logo"
                sx={{ width: 50, height: 50 }}
                variant="rounded"
              />
            } */
            title="Login"
            titleTypographyProps={{ color: useColor, fontWeight: "600" }}
          ></CardHeader>
        )}
        {context.userLogged !== null && (
          <CardHeader
            title={`Bienvenido ${context.userLogged.Name}`}
            avatar={
              <Avatar
                src={Logo}
                alt="Hamlet logo"
                sx={{ width: 150, height: 150 }}
                variant="rounded"
              />
            }
          ></CardHeader>
        )}
        <CardContent>
          {context.userLogged !== null && <Profile />}
          {context.userLogged === null && (
            <FormControl sx={{ width: "90%" }}>
              <form name="Register" onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 3, md: 5 }}
                  columns={{ xs: 1, sm: 4, md: 12 }}
                >
                  <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                    <TextField
                      id="email"
                      label="email"
                      defaultValue={""}
                      autoComplete="email"
                      name="email"
                      {...register("email", {
                        required: true,
                        minLength: 3,
                        maxLength: 40,
                      })}
                      onBlur={() => {
                        trigger("email");
                      }}
                      color={useColor}
                      variant={useVariant}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                    <TextField
                      id="password"
                      label="password"
                      defaultValue={""}
                      autoComplete="password"
                      type="password"
                      name="password"
                      color={useColor}
                      variant={useVariant}
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
                  <Grid
                    sx={{ alignSelf: "left" }}
                    size={{ xs: 6, sm: 6, md: 6 }}
                  >
                    <Button type="submit" color={useColor} variant="contained">
                      Ingresar
                    </Button>
                  </Grid>
                  <Grid
                    sx={{ alignSelf: "left" }}
                    size={{ xs: 6, sm: 6, md: 6 }}
                  >
                    <Button
                      color={useColor}
                      variant="text"
                      onClick={() => setShowForgotPasswordForm(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </Grid>
                </Grid>
                {error !== "" && (
                  <Grid
                    sx={{ alignSelf: "right" }}
                    size={{ xs: 6, sm: 2, md: 9 }}
                  >
                    <ErrorMessage
                      title="Credenciales inválidas"
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
    </Container>
  );

  const ForgotPassword = (
    <Container
      height={"auto"} //context.userLogged === null ? "100%" :
      maxWidth={context.userLogged === null ? "sm" : "lg"}
      sx={{
        padding: "auto",
        marginTop: "auto",
        marginBottom: "auto",
        alignItems: "center",
      }}
    >
      <Card elevation={10}>
        <CardHeader
          title="Recuperar Contraseña"
          titleTypographyProps={{ color: useColor, fontWeight: "600" }}
        />
        <FormControl sx={{ width: "90%", m: 5 }}>
          <form onSubmit={handleSubmit(forgottenPassword)}>
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 5 }}
              columns={{ xs: 1, sm: 4, md: 12 }}
            >
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  id="email"
                  label="Correo Electrónico"
                  color={useColor}
                  variant={useVariant}
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
              <Grid size={{ xs: 12 }}>
                <Button type="submit" color={useColor} variant="contained">
                  Enviar Correo de Recuperación
                </Button>
                <Button
                  onClick={() => setShowForgotPasswordForm(false)}
                  color={useColor}
                  variant="outlined"
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
            {successMessage && (
              <ErrorMessage
                message={successMessage.message}
                severity="success"
                action={resetSuccess}
              />
            )}
          </form>
        </FormControl>
      </Card>
    </Container>
  );

  return loading
    ? loadingRender
    : showForgotPasswordForm
      ? ForgotPassword
      : success;
};
