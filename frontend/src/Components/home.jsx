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

//Stats
import StatsCollector from "./utils/stats/StatsCollector";
import JobsForNextDays from "./utils/stats/JobsForNextWeeks";
import JobsPerDate from "./utils/stats/JobsPerDate";
import JobsPerClient from "./utils/stats/JobsPerClient"
//MUI Material Imports
import { Container, Grid, Typography, Divider, Box } from "@mui/material";

const Home = () => {
  const getToken = () => {
    const tkn = localStorage.getItem("token");
    return tkn;
  };

  const context = useContext(ImpoContext);

  return (
    <Container disableGutters maxWidth={false}>
      <Grid container columns={{ xs: 1, sm: 12, md: 12, lg: 16 }} spacing={0}>
        <Grid item xs={1} sm={12} md={8} lg={10}>
          <Container>
            <Grid container spacing="3" columns={{ xs: 1, sm: 12, md: 12 }}>
              <Grid item xs={1} sm={12} md={12}>
                <DarkWoodCard>
                  <FullJobsRender
                    route="jobs/urg"
                    settings={{
                      title: "Proximas entregas",
                      column: "deadLine",
                      order: "asc",
                    }}
                  />
                </DarkWoodCard>
              </Grid>
              <Grid item xs={1} sm={12} md={12} lg={12}>
                <DarkWoodCard>
                  <StatsCollector>
                    <JobsForNextDays />
                    <JobsPerDate />
                  </StatsCollector>
                </DarkWoodCard>
              </Grid>
              
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={1} sm={12} md={4} lg={6}>
            <Grid container columns={12} spacing={1}>
              <Grid item xs={12} sm={12} md={11}>
                  <MyStepper />
              </Grid>
              <Grid item xs={12} sm={12} md={11}>
                <DarkWoodCard>
                  <QuickSpinCalc />
                </DarkWoodCard>
              </Grid>
              <Grid item xs={12} sm={12} md={11}>
                <ImpoProvider>
                  <DarkWoodCard>
                    <Canvas />
                  </DarkWoodCard>
                </ImpoProvider>
              </Grid>
            </Grid> 
          </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
