import React from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
} from "@mui/material/";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { Login } from "./Login";
import FormMaterial from "../Formulario/FormMaterial";
import tenantsDataForm from "../Formulario/tenantsDataForm";
import { ReactComponent as Logo } from "../../img/Logo/logo ok-05.svg";
import sky from "../../img/Sky.jpg";
import rio from "../../img/rio.jpg";
import paperBackground from "../../img/paperBackground.jpg";
import pinar from "../../img/pinar.jpg";
import roble from "../../img/roble.jpg";
import cordoba from "../../img/cordoba.webp";

export const LogPage = () => {
  const variant4All = "standard";
  const color4All = "primary";
  const cardVariant = "elevation";
  const cardHeaderStyle = {
    fontFamily: "Open Sans, sans-serif",
    variant: "h4",
    fontWeight: "100",
    color: "primary",
  };

  const Navigate = useNavigate();

  const cardStyle = {
    background: "#fff",
    border: "1px solid #fff",
  };

  return (
    <Container
      sx={{
        margin: "15px",
        display: "flex",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={12}>
          <Grid
            container
            sx={{
              alignItems: "stretch",
              backgroundSize: "fit-content",
              background: `#ffffffcc`,
              backdropFilter: "blur(2px)",
              boxShadow: 0,
              borderRadius: "0px",
              margin: "auto",
              padding: "0",
              justifyItems: "space-around",
            }}
          >
            <Grid
              item
              xs={12}
              md={4}
              alignItems={"center"}
              sx={{
                padding: "0",
                width: "fit-content",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Logo
                role="img"
                aria-label="Hamlet logo"
                style={{
                  width: "100%",
                  maxWidth: 600,
                  marginBottom: 32,
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-evenly",
                minHeight: "390px",
                height: "100%",
              }}
            >
              <Typography
                color={"white"}
                sx={{
                  background: "#770077",
                  padding: "5px 10px 5px 10px",
                  fontWeight: "700",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  borderRadius: "5px",
                  display: "inline-block",
                  margin: "20px 15px 15px 0px",
                }}
              >
                Hamlet
              </Typography>
              <Typography
                variant="h2"
                fontWeight={100}
                fontFamily={"Open Sans, sans-serif"}
                gutterBottom
                color={"rgb(2, 56, 66)"}
                //sx={{ textShadow: "2px 2px 1px #00000088" }}
              >
                Gestión para talleres gráficos.
              </Typography>

              <Typography
                variant="h4"
                color={"secondary"}
                fontWeight={100}
                fontFamily={"Open Sans, sans-serif"}
                //sx={{ textShadow: "2px 1px 6px #00000066" }}
              >
                Presupuestos, pedidos y producción basados en la realidad de tu
                imprenta.
              </Typography>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
                sx={{ margin: "15px 0 0 0", alignSelf: "flex-start" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => Navigate("/login")}
                >
                  Ingresar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => Navigate("/register")}
                >
                  Registrarse
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                padding: "15px",
              }}
            >
              <Card variant={cardVariant} style={cardStyle}>
                <CardHeader
                  titleTypographyProps={cardHeaderStyle}
                  title="Estructura flexible"
                ></CardHeader>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={100}
                    fontFamily={"Open Sans, sans-serif"}
                    gutterBottom
                    color={"rgb(2, 56, 66)"}
                  >
                    Hamlet se adapta a la forma en que trabaja tu imprenta,
                    permitiendo definir máquinas, materiales, formatos y
                    procesos para gestionar pedidos, presupuestos y producción.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} sx={{ padding: "15px" }}>
              <Card variant={cardVariant} style={cardStyle}>
                <CardHeader
                  title="Lógica de trabajo"
                  titleTypographyProps={cardHeaderStyle}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={100}
                    fontFamily={"Open Sans, sans-serif"}
                    gutterBottom
                    color={"rgb(2, 56, 66)"}
                  >
                    Hamlet refleja la manera en que los trabajos se piensan y se
                    producen en el taller, respetando procesos, etapas y
                    criterios propios de cada imprenta.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} sx={{ padding: "15px" }}>
              <Card variant={cardVariant} style={cardStyle}>
                <CardHeader
                  title="Información estadística"
                  titleTypographyProps={cardHeaderStyle}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={100}
                    fontFamily={"Open Sans, sans-serif"}
                    gutterBottom
                    color={"rgb(2, 56, 66)"}
                  >
                    La información histórica y estadística del taller está
                    siempre disponible para acompañar la toma de decisiones con
                    más criterio y menos urgencia.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* COLUMNA DERECHA – ACCESO */}
        {/*<Grid item xs={12} md={7}>
          <Grid container spacing={4} direction="column">
            <Grid item>
              <Login color={color4All} variant={variant4All} />
            </Grid>

            <Grid item>
              <FormMaterial
                form={tenantsDataForm}
                collection="tenants"
                task="new"
                title="Registrar imprenta"
                variant={variant4All}
                color={color4All}
              />
            </Grid>
          </Grid>
        </Grid>*/}
      </Grid>
    </Container>
  );
};
