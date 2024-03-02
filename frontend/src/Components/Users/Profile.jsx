import React from "react";
import { Box, Typography, Container, Grid, CardHeader } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { serverURL, databaseURL } from "../Config/config";
import MainContainer from "../General/MainContainer";
import Fetch from "../General/Fetch";
import SessionTimer from "./SessionTimer";

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
              Correo electronico: {context.userLogged.email}
            </Typography>
            <br></br>
            <Typography>Rol: {context.userLogged.Role}</Typography>
            <br></br>
            <SessionTimer />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={1} sm={12} md={8}>
        <Container>
          <Fetch
            collection="jobs"
            subdir={`/owner/${context.userLogged._id}`}
          />
        </Container>
      </Grid>
    </Grid>
  );
};
