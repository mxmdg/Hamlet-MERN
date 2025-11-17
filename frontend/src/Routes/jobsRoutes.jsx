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
import JobsPerPartType from "../Components/utils/stats/JobsPerPartType";

export const jobsRoutes = () => (
  <>
    //Rutas en uso, para buscar, ver, editar, copiar, agregar trabajos.
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
    <Route path="/Jobs/edit/:id" element={<JobViewer entity={"Jobs"} />} />
    <Route path="/Jobs/copy/:id" element={<JobsEditAndCopy />} />
    // Esta ruta solo trae las partes de trabajo, pero no se pueden editar ni
    saber a que trabajo pertencen.
    <Route
      path="/Jobs/partes"
      element={<MainContainer entity={"jobs/partes"} />}
    />
    // Una ruta poco util, solo trae las estadisticas de todos los trabajos.
    <Route
      path="/Jobs/stats"
      element={
        <StatsCollector route="jobs/complete">
          <JobsPerDate />
          <JobsPerType />
          <JobsPerClient rank={5} />
          <JobsPerSeller />
          <JobsPerType />
          <JobsPerPartType rank={7} />
        </StatsCollector>
      }
    />
    <Route path="/Jobs/add" element={<MyStepper />} />
    // Falta desarrollar JobProvider para mejorar la carga de trabajos, estas
    rutas no estan listas todavia.
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
    // Ruta para ver la lista completa de trabajos sin partes, carga mas rapida.
    <Route path="/Jobs/fullList" element={<JobsContainer entity={"Jobs"} />} />
  </>
);
