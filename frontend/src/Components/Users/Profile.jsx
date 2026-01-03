import React from "react";
import { Box, Typography, Container, Grid, CardHeader } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { serverURL, databaseURL } from "../Config/config";
import MainContainer from "../General/MainContainer";
import FullJobsRender from "../Pages/FullJobsRender";
import Fetch from "../General/Fetch";
import SessionTimer from "./SessionTimer";
import ColorPalette from "../Config/Theme/ColorPallete";
import FormMaterial from "../Formulario/FormMaterial";
import preferencesForm from "../Formulario/NewMessageForm";
import tenantsDataForm from "../Formulario/tenantsDataForm";

export const Profile = () => {
  //User Profile
  const context = useContext(AuthContext);

  return (
    <Grid
      container
      columns={{ xs: 1, sm: 12, md: 12 }}
      spacing={1}
      sx={{ justifyContent: "flex-end" }}
    >
      <Grid item xs={1} sm={12} md={4}>
        <Card>
          <CardHeader title={`Hola ${context.userLogged.Name}`} />
          <CardContent>
            <Typography>
              Correo electrónico: {context.userLogged.email}
            </Typography>

            <br />

            <Typography variant="h6">Membresías</Typography>

            {context.memberships?.length > 0 ? (
              context.memberships.map((m, index) => (
                <Box key={index} sx={{ mt: 1, p: 1, border: "1px solid #ddd" }}>
                  <Typography>
                    Imprenta: <strong>{m.tenant.name}</strong>
                  </Typography>
                  <Typography>
                    Rol: <strong>{m.role}</strong>
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No tiene membresías activas</Typography>
            )}

            <br />

            <SessionTimer />
          </CardContent>

          <FormMaterial
            form={preferencesForm}
            task="new"
            title={"Preferencias de usuario"}
            action={(e) => {
              console.log(e);
              localStorage.setItem("appTheme", e.colorTheme);
              window.location.reload();
            }}
          />
          {/* <CardActions>
            <ColorPalette />
          </CardActions> */}
        </Card>
      </Grid>

      <Grid item xs={1} sm={12} md={8}>
        <Container>
          <FullJobsRender
            route={`jobs/owner/${context.userLogged._id}`}
            settings={{
              title: `Trabajos para ${context.userLogged.Name}`,
              column: "deadLine",
              order: "asc",
            }}
          />
          {/* <Fetch
            collection="jobs"
            subdir={`/owner/${context.userLogged._id}`}
          /> */}
        </Container>
      </Grid>
    </Grid>
  );
};
