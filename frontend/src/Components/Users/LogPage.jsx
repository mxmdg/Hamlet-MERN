import React from "react";
import { Container, Grid, Divider, Paper, Typography } from "@mui/material/";
import { Register } from "./Register";
import { Login } from "./Login";
import QuickSpinCalc from "../utils/spinCalculator/QuickSpinCalc";
import NumberGenerator from "../utils/generalData/NumberGenerator";
import ImpoProvider from "../utils/impo/ImpoContext";
import Canvas from "../utils/impo/Canvas";
import ColorSheetRangeGenerator from "../utils/generalData/ColorSheetRangeGenerator";
import FormMaterial from "../Formulario/FormMaterial";
import tenantsDataForm from "../Formulario/tenantsDataForm";
import { ReactComponent as Logo } from "../../img/Logo/logo ok-01.svg";

export const LogPage = () => {
  return (
    <Container sx={{ m: "20px" }}>
      <Grid container spacing={2} columns={12} alignItems="flex-start">
        <Grid item xs={12} sm={2} md={2} lg={2} textAlign="left">
          <Logo
            role="img"
            aria-label="Hamlet logo"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Login />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Register />
        </Grid>
        {/* <Grid item xs={1} sm={12} md={5}>
          <FormMaterial
            form={tenantsDataForm}
            collection={"tenants"}
            task="new"
            title={"Agregar nueva Imprenta"}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
};
