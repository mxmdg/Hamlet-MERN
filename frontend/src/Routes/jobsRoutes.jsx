import { Route } from "react-router-dom";
import JobFinder from "../Components/Jobs/JobFinder";
import { JobProperties } from "../Components/utils/PropertiesMaps/jobsMap";
import MainContainer from "../Components/General/MainContainer";
import StatsCollector from "../Components/utils/stats/StatsCollector";
import JobsPerDate from "../Components/utils/stats/JobsPerDate";
import JobsPerType from "../Components/utils/stats/JobsPerType";
import JobsPerClient from "../Components/utils/stats/JobsPerClient";
import JobsPerSeller from "../Components/utils/stats/JobsPerSeller";
import MyStepper from "../Components/Jobs/Stepper";
import { JobProvider } from "../Components/Jobs/JobContext";
import CurrentJob from "../Components/Jobs/JobContextChildren/CurrentJob";
import { JobViewer } from "../Components/jobViewer/JobViewer";
import JobsEditAndCopy from "../Components/Pages/JobsEditAndCopy";
import JobsContainer from "../Components/Jobs/JobsContainer";

export const jobsRoutes = () => (
  <>
    <Route
      path="/Jobs"
      element={
        <JobFinder
          entity={"jobs/complete"}
          propertiesMap={JobProperties}
          inputsColor={"primary"}
        />
      }
    />
    <Route
      path="/Jobs/partes"
      element={<MainContainer entity={"jobs/partes"} />}
    />
    <Route
      path="/Jobs/stats"
      element={
        <StatsCollector route="jobs/complete">
          <JobsPerDate />
          <JobsPerType />
          <JobsPerClient rank={6} />
          <JobsPerSeller />
          <JobsPerType />
        </StatsCollector>
      }
    />
    <Route path="/Jobs/add" element={<MyStepper />} />
    <Route
      path="Jobs/Context/:id"
      element={
        <JobProvider>
          <CurrentJob />
        </JobProvider>
      }
    />
    <Route
      path="Jobs/Context"
      element={
        <JobProvider>
          <CurrentJob />
        </JobProvider>
      }
    />
    <Route path="/Jobs/edit/:id" element={<JobViewer entity={"Jobs"} />} />
    <Route path="/Jobs/copy/:id" element={<JobsEditAndCopy />} />
    <Route path="/Jobs/fullList" element={<JobsContainer entity={"Jobs"} />} />
  </>
);
