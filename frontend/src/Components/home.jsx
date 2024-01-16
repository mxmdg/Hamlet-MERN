import { useContext } from "react";

import Canvas from "./utils/impo/Canvas";
import ImpoProvider from "./utils/impo/ImpoContext";
import { ImpoContext } from "./utils/impo/ImpoContext";
import Fetch from "./General/Fetch";
import QuickSpinCalc from "./utils/spinCalculator/QuickSpinCalc";
import DarkWoodCard from "./utils/DarkWoodCard";
import PrintersMainContainer from "./Printers/PrintersMainContainer";
import ToggleColorMode from "./Config/Theme/ToggleMode";
import MyStepper from "./Jobs/Stepper";

//MUI Material Imports
import { Container, Grid, Typography, Divider, Box } from "@mui/material";

const Home = () => {
  const getToken = () => {
    const tkn = localStorage.getItem("token");
    return tkn;
  };

  const context = useContext(ImpoContext);

  return (
    <>
      <Grid container columns={{ xs: 1, sm: 12, md: 12 }} spacing={4}>
        <Grid item xs={1} sm={12} md={8}>
          <Container>
            <Grid container spacing="3" columns={{ xs: 1, sm: 12, md: 12 }}>
              <Grid item xs={1} sm={12} md={12}>
                <Fetch collection="jobs/urg" />
              </Grid>

              <Grid item xs={1} sm={6} md={8}>
                <ImpoProvider>
                  <DarkWoodCard>
                    <Canvas />
                  </DarkWoodCard>
                </ImpoProvider>
              </Grid>

              <Grid item xs={1} sm={6} md={4}>
                <DarkWoodCard>
                  <QuickSpinCalc />
                </DarkWoodCard>
              </Grid>
            </Grid>

            <Divider />
            <Typography variant="subtitle" color={"secondary"} gutterBottom>
              Token: {getToken() ? "Habilitado" : "Inhabilitado"}
            </Typography>
          </Container>
        </Grid>
        <Grid item xs={1} sm={12} md={4}>
          <DarkWoodCard>
            <MyStepper />
          </DarkWoodCard>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
