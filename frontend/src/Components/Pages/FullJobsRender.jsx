import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Spinner from "../General/Spinner";
import JobRow from "../Jobs/jobsTable/JobRow";
import { fechtData, getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import CollapsibleTable from "../Jobs/jobsTable/CollapsibleTable";

const FullJobsRender = () => {
  const [jobList, setJobList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const resetError = () => {
    console.log("reset error");
    setError(null);
  };

  const AlertError = (
    <ErrorMessage
      message={error?.message}
      //severity={error.severity}
      action={resetError}
    />
  );

  const JobListRender = () => {
    return (
      <>
        {jobList.length > 1 &&
          jobList.map((item) => {
            return <JobRow job={item} key={item._id} />;
          })}
      </>
    );
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await getPrivateElements("jobs/complete");
        setJobList(jobs);
        setError(null);
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
        return;
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      {loading ? (
        <Spinner color="primary" />
      ) : error !== null ? (
        AlertError
      ) : jobList ? (
        <CollapsibleTable rows={jobList}/>
      ) : (
        <Typography color={"error"}> NO Data </Typography>
      )}
    </Container>
  );
};

export default FullJobsRender;
