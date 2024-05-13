import { Grid, Container } from "@mui/material";

import StatsCollector from "../utils/stats/StatsCollector";
import JobsPerClient from "../utils/stats/JobsPerClient";
import JobsPerSeller from "../utils/stats/JobsPerSeller";
import JobsPerType from "../utils/stats/JobsPerType";
import JobsPerDate from "../utils/stats/JobsPerDate";
import JobsForNextDays from "../utils/stats/JobsForNextWeeks";

const StatsGrid = () => {
  const render = (
    <Grid container>
      <Grid item>
        <StatsCollector>
          <JobsForNextDays></JobsForNextDays>
        </StatsCollector>
      </Grid>
    </Grid>
  );
};
