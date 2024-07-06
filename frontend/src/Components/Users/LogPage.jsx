import React from "react";
import { Container, Grid, Divider, Paper } from "@mui/material/";
import { Register } from "./Register";
import { Login } from "./Login";
import QuickSpinCalc from "../utils/spinCalculator/QuickSpinCalc";
import ImpoProvider from "../utils/impo/ImpoContext";
import Canvas from "../utils/impo/Canvas";

export const LogPage = () => {


  return (
    <Container sx={{m: "20px"}}>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12} sm={6}>
          <Login />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Register />
        </Grid>
        <Grid item xs={12} sm={4}>
          <QuickSpinCalc />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper elevation={10}>
            <ImpoProvider>
              <Canvas />
            </ImpoProvider>
          </Paper>
        </Grid>
      </Grid>
      
    </Container>
  );
};
