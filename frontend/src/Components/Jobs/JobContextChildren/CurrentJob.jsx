import React, { useContext } from "react";
import { JobContext } from "../JobContext";
import JobsForm from "../JobsForm";

import { Container, Grid, Button } from "@mui/material";

const CurrentJob = () => {
  const context = useContext(JobContext);
  const { job, setJob, jobType, setJobType } = context;

  //if (!job) return <p>No job selected</p>;

  console.log(context);

  return (
    <Container>
      <JobsForm
        jobType={jobType}
        {...(jobType && { jobType: jobType })}
        setJobType={setJobType}
        {...(job && { data: job.data })}
        setJob={setJob}
        continue={() => {
          console.log(job);
        }}
      />
    </Container>
  );
};

export default CurrentJob;
