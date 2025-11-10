import React from "react";
import { Container, Grid, Divider, Paper, Typography } from "@mui/material/";
import { Register } from "./Register";
import { Login } from "./Login";
import QuickSpinCalc from "../utils/spinCalculator/QuickSpinCalc";
import NumberGenerator from "../utils/generalData/NumberGenerator";
import ImpoProvider from "../utils/impo/ImpoContext";
import Canvas from "../utils/impo/Canvas";
import ColorSheetRangeGenerator from "../utils/generalData/ColorSheetRangeGenerator";
import { ReactComponent as Logo } from "../../img/Logo/logo ok-01.svg";

export const LogPage = () => {
  return (
    <Container sx={{ m: "20px" }}>
      <Grid container spacing={2} columns={12}>
        {/* <Grid item xs={4} sm={4} md={4} lg={4} textAlign="center">
          <Logo
            role="img"
            aria-label="Hamlet logo"
            style={{
              width: "150px",
              height: "150px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} textAlign="left">
          <Typography
            variant="h1"
            color={"secondary"}
            fontStyle={"italic"}
            fontFamily={"Times"}
          >
            Bienvenido a <br></br>HAMLET
          </Typography>
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Login />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Register />
        </Grid>
        <Grid item xs={12} sm={4}>
          <QuickSpinCalc />
          <NumberGenerator />
          <ColorSheetRangeGenerator />
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
