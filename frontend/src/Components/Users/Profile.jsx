import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Container, CardHeader } from "@mui/material/";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import FullJobsRender from "../Pages/FullJobsRender";
import SessionTimer from "./SessionTimer";
import FormMaterial from "../Formulario/FormMaterial";
import { useUserPreferences } from "../../Hooks/useUserPreferences";

export const Profile = () => {
  //User Profile
  const context = useContext(AuthContext);
  const { prefs, savePrefs } = useUserPreferences();

  const [useMemberships, setUseMemberships] = React.useState(
    context.memberships || [],
  );

  useEffect(() => {}, [setUseMemberships]);

  const userSettingsFormData = [
    //Apariencia
    {
      inputName: "mode",
      label: "Modo Claro/Oscuro",
      type: "Select",
      id: "formMode",
      options: [
        { text: "Claro", value: "light" },
        { text: "Oscuro", value: "dark" },
      ],
    },
    {
      inputName: "variant",
      label: "Estilo de formulario",
      type: "Select",
      id: "formStyle",
      options: [
        { text: "Estandar", value: "standard" },
        { text: "Relleno", value: "filled" },
        { text: "Filete", value: "outlined" },
      ],
    },
    {
      inputName: "color",
      lable: "Color de formulario",
      type: "Select",
      id: "formColor",
      options: [
        { text: "Esmeralda", value: "primary" },
        { text: "Uva", value: "secondary" },
        { text: "Arena", value: "warning" },
        { text: "Oceano", value: "info" },
        { text: "Limon", value: "success" },
      ],
    },
  ];

  return (
    <Container>
      <Grid container columns={12} spacing={1}>
        <Grid xs={12} sm={3}>
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
                  <Card
                    key={index}
                    elevation={6}
                    sx={{
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "2px solid transparent",
                      cursor: "pointer",
                      ":hover": { border: "2px solid cyan" },
                    }}
                    onClick={() => {
                      const newMemberships = [
                        m,
                        ...context.memberships.filter((_, i) => i !== index),
                      ];
                      setUseMemberships(newMemberships);
                      localStorage.setItem(
                        "memberships",
                        JSON.stringify(newMemberships),
                      );
                      window.location.reload();
                    }}
                  >
                    <Typography color={index === 0 ? "success" : "primary"}>
                      Imprenta: <strong>{m.tenant.name}</strong> / Rol: {m.role}{" "}
                      / estado: {m.tenant.status}
                    </Typography>
                  </Card>
                ))
              ) : (
                <Typography>No tiene membresías activas</Typography>
              )}

              <br />
              <FormMaterial
                form={userSettingsFormData}
                task="local"
                submitText="Guardar"
                action={savePrefs}
                variant={prefs?.variant || "outlined"}
                color={prefs?.color || "info"}
                item={prefs} // 👈 esto es CLAVE
              />

              <SessionTimer />
            </CardContent>
            {useMemberships[0].role === "admin" && (
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="text"
                  href={"/tenant/settings/" + useMemberships[0]?.tenant.id}
                  color="warning"
                >
                  Ajustes del sistema
                </Button>
              </CardActions>
            )}

            {/* <CardActions>
            <ColorPalette />
          </CardActions> */}
          </Card>
        </Grid>

        <Grid xs={12} sm={9}>
          <Box>
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
