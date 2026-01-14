import React from "react";
import { Container, Grid, Box, Divider } from "@mui/material/";
import { Login } from "./Login";
import FormMaterial from "../Formulario/FormMaterial";
import tenantsDataForm from "../Formulario/tenantsDataForm";
import { ReactComponent as Logo } from "../../img/Logo/logo ok-05.svg";

export const LogPage = () => {
  const variant4All = "standard";
  const color4All = "primary";

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={5} alignItems="flex-start">
        {/* COLUMNA IZQUIERDA – LOGO */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              height: "100%",
            }}
          >
            <Logo
              role="img"
              aria-label="Hamlet logo"
              style={{ width: "100%", maxWidth: 400 }}
            />
          </Box>
        </Grid>

        {/* COLUMNA DERECHA – FORMULARIOS */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={5} direction="column">
            <Grid item>
              <Login color={color4All} variant={variant4All} />
            </Grid>

            <Grid item>
              <FormMaterial
                form={tenantsDataForm}
                collection="tenants"
                task="new"
                title="Registrar Imprenta"
                variant={variant4All}
                color={color4All}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
