import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

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
import ColorSheetRangeGenerator from "./utils/generalData/ColorSheetRangeGenerator";

//Stats
import StatsCollector from "./utils/stats/StatsCollector";
import JobsForNextDays from "./utils/stats/JobsForNextWeeks";
import JobsPerDate from "./utils/stats/JobsPerDate";
import JobsPerClient from "./utils/stats/JobsPerClient";
import JobsPerSeller from "./utils/stats/JobsPerSeller";
import JobsPerType from "./utils/stats/JobsPerType";
//MUI Material Imports
import { Container, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import UploadFilesButton from "./utils/ReusableComponents/UploadFilesButton";
import JobsPerPartType from "./utils/stats/JobsPerPartType";

const Home = (props) => {
  const [useRoute, setUseRoute] = useState(props.route || "jobs/urg");
  const getToken = () => {
    const tkn = localStorage.getItem("token");
    return tkn;
  };

  const context = useContext(AuthContext);

  useEffect(() => {
    // Verifica expiración del JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          localStorage.removeItem("token");
          // navigate("/", { replace: true }); // <-- revertido
        }
      } catch (e) {
        localStorage.removeItem("token");
        // navigate("/", { replace: true }); // <-- revertido
      }
    }
  }, []);

  const homePage = (
    <>
      <Grid container spacing={3} p={2}>
        <Grid size={{ xs: 12, sm: 8, md: 8 }}>
          <Grid
            container
            spacing={{ xs: 0, sm: 1, md: 3 }}
          >
            <Grid size={12}>
              <FullJobsRender
                route={useRoute}
                settings={{
                  title: "Proximas entregas",
                  column: "deadLine",
                  order: "asc",
                }}
              />
            </Grid>
            <Grid size={12}>
              <StatsCollector route={useRoute}>
                <JobsForNextDays />
                <JobsPerType />
                <JobsPerPartType rank={10} />
                <JobsPerClient rank={10} />
                <JobsPerSeller />
              </StatsCollector>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid
            container
            spacing={{ xs: 0, sm: 1, md: 3 }}
          >
            <Grid size={12}>
              <UploadFilesButton />
              <MyStepper />
            </Grid>
            <Grid size={12}>
              <QuickSpinCalc color="primary" />
            </Grid>
            <Grid size={12}>
              <NumberGenerator color="primary" />
            </Grid>
            <Grid size={12}>
              <ColorSheetRangeGenerator color="primary" />
            </Grid>
            <Grid size={12}>
              <ImpoProvider>
                <DarkWoodCard>
                  <Canvas />
                </DarkWoodCard>
              </ImpoProvider>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );

  const logPage = <LogPage />;
  return context.useLogin ? homePage : logPage;
};

export default Home;
