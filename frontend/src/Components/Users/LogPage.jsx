import React from "react";
import { Container, Grid } from "@mui/material/";
import { Register } from "./Register";
import { Login } from "./Login";

export const LogPage = () => {
  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item>
          <title>Login:</title>
          <Login />
        </Grid>
        <Grid item>
          <title>Register:</title>
          <Register />
        </Grid>
      </Grid>
    </Container>
  );
};
