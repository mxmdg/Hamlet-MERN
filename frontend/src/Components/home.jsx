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
import FullJobsRender from "./Pages/FullJobsRender";

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
                <FullJobsRender
                  route="jobs/urg"
                  settings={{
                    title: "Proximas entregas",
                    column: "deadLine",
                    order: "asc",
                  }}
                />
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
