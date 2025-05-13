import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

import Canvas from "./utils/impo/Canvas";
import ImpoProvider from "./utils/impo/ImpoContext";
import { ImpoContext } from "./utils/impo/ImpoContext";
import Fetch from "./General/Fetch";
import QuickSpinCalc from "./utils/spinCalculator/QuickSpinCalc";
import DarkWoodCard from "./utils/DarkWoodCard";
import PrintersMainContainer from "./Printers/PrintersMainContainer";
import ToggleColorMode from "./Config/Theme/ToggleMode";
import MyStepper from "./Jobs/Stepper";
import JobEditor from "./Jobs/JobEditor/JobEditor";
import FullJobsRender from "./Pages/FullJobsRender";
import { Login } from "./Users/Login";
import { LogPage } from "./Users/LogPage";
import NumberGenerator from "./utils/generalData/NumberGenerator";

//Stats
import StatsCollector from "./utils/stats/StatsCollector";
import JobsForNextDays from "./utils/stats/JobsForNextWeeks";
import JobsPerDate from "./utils/stats/JobsPerDate";
import JobsPerClient from "./utils/stats/JobsPerClient";
import JobsPerSeller from "./utils/stats/JobsPerSeller";
import JobsPerType from "./utils/stats/JobsPerType";
//MUI Material Imports
import { Container } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import UploadFilesButton from "./utils/ReusableComponents/UploadFilesButton";

const Home = (props) => {
  const [useRoute, setUseRoute] = useState(props.route || "jobs/urg");
  const getToken = () => {
    const tkn = localStorage.getItem("token");
    return tkn;
  };

  const context = useContext(AuthContext);

  const homePage = (
    <Container
      fullwidth
      disableGutters
      maxWidth={"false"}
      sx={{ paddingTop: 3 }}
    >
      <Grid container columns={{ xs: 1, sm: 12, md: 12, lg: 16 }} spacing={0}>
        <Grid item xs={1} sm={12} md={12} lg={10}>
          <Container>
            <Grid
              container
              spacing={{ xs: 0, sm: 1, md: 3 }}
              columns={{ xs: 1, sm: 12, md: 12 }}
            >
              <Grid item xs={1} sm={12} md={12}>
                <FullJobsRender
                  route={useRoute}
                  settings={{
                    title: "Proximas entregas",
                    column: "deadLine",
                    order: "asc",
                  }}
                />
              </Grid>
              <Grid item xs={1} sm={12} md={12} lg={12}>
                <StatsCollector route={useRoute}>
                  <JobsForNextDays />
                  <JobsPerType />
                  <JobsPerClient rank={10} />
                  <JobsPerSeller />
                </StatsCollector>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={1} sm={12} md={12} lg={6}>
          <Grid container columns={12} spacing={{ xs: 0, sm: 1, md: 3 }}>
            <Grid item xs={12} sm={12} md={10} lg={10}>
              <UploadFilesButton />
              <MyStepper />
            </Grid>
            <Grid item xs={12} sm={12} md={11} lg={10}>
              <QuickSpinCalc />
            </Grid>
            <Grid item xs={12} sm={12} md={11} lg={10}>
              <NumberGenerator />
            </Grid>
            <Grid item xs={12} sm={12} md={11} lg={10}>
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

  const logPage = <LogPage />;
  return context.useLogin ? homePage : logPage;
};

export default Home;
