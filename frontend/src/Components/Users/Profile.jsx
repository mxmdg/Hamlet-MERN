import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  CardHeader,
} from "@mui/material/";
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
import { set } from "react-hook-form";

export const Profile = () => {
  //User Profile
  const context = useContext(AuthContext);
  const [useMemberships, setUseMemberships] = React.useState(
    context.memberships || []
  );

  useEffect(() => {
    console.log("User Profile Mounted");
  }, [setUseMemberships]);

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
                      JSON.stringify(newMemberships)
                    );
                    window.location.reload();
                  }}
                >
                  <Typography color={index === 0 ? "success" : "primary"}>
                    Imprenta: <strong>{m.tenant.name}</strong> / Rol: {m.role} /
                    estado: {m.tenant.status}
                  </Typography>
                </Card>
              ))
            ) : (
              <Typography>No tiene membresías activas</Typography>
            )}

            <br />

            <SessionTimer />
          </CardContent>
          {useMemberships[0].role === "admin" && (
            <CardActions>
              <Button
                variant="contained"
                href={"/tenant/settings/" + useMemberships[0]?.tenant.id}
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
