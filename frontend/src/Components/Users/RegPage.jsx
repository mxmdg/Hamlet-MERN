import React from "react";
import Container from "@mui/material/Container";
// Grid, Box, Divider
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Login } from "./Login";
import { Register } from "./Register";
import FormMaterial from "../Formulario/FormMaterial";
import membershipsDataForm from "../Formulario/membershipsDataForm";
import { ReactComponent as Logo } from "../../img/Logo/logo ok-05.svg";

export const RegPage = () => {
  const variant4All = "standard";
  const color4All = "primary";

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={5} alignItems="flex-start">
        {/* COLUMNA IZQUIERDA – LOGO */}
        <Grid size={{ xs: 12, md: 4 }}>
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
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={5} direction="column">
            <Grid size={12}>
              <Register
                title={"Agregar usuario"}
                subtitle="Ingresar usuario al sistema, si no existe, antes de crear la membresía."
                color={color4All}
                variant={variant4All}
              />
            </Grid>

            <Grid size={12}>
              <FormMaterial
                form={membershipsDataForm}
                collection="memberships"
                task="new"
                title="Agregar Membresía"
                subtitle="Atencion! El usuario debe ester registrado previamente"
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
