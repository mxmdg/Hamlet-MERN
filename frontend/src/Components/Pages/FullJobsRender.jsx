import React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import Spinner from "../General/Spinner";
import JobRow from "../Jobs/jobsTable/JobRow";
import { fechtData, getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import CollapsibleTable from "../Jobs/jobsTable/CollapsibleTable";
import DarkWoodCard from "../utils/DarkWoodCard";

const FullJobsRender = (props) => {
  const [jobList, setJobList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [useDeleted, setDeleted] = React.useState([]);

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
        const jobs = await getPrivateElements(props.route);
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
  }, [useDeleted]);

  return (
    <Container>
      {loading ? (
        <Spinner color="primary" />
      ) : error !== null ? (
        AlertError
      ) : jobList ? (
        <Card elevation={6}>
          <CollapsibleTable
            rows={jobList.length > 0 ? jobList : [, , ,]}
            route={props.route}
            settings={props.settings}
            deleted={setDeleted}
          />
        </Card>
      ) : (
        <Typography color={"error"}> NO Data </Typography>
      )}
    </Container>
  );
};

export default FullJobsRender;
