import React, { useEffect } from "react";
import { Box, Button, Typography, Container, CardHeader } from "@mui/material/";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import FullJobsRender from "../Pages/FullJobsRender";
import SessionTimer from "./SessionTimer";

export const Profile = () => {
  //User Profile
  const context = useContext(AuthContext);
  const [useMemberships, setUseMemberships] = React.useState(
    context.memberships || []
  );

  useEffect(() => {}, [setUseMemberships]);

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
                        JSON.stringify(newMemberships)
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
