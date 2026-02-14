import React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Card, CardActions, CardContent, ButtonGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import Spinner from "../General/Spinner";
import JobRow from "../Jobs/jobsTable/JobRow";
import { fechtData, getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import CollapsibleTable from "../Jobs/jobsTable/CollapsibleTable";
import DarkWoodCard from "../utils/DarkWoodCard";
import DownloadCSV from "../utils/DownloadCSV/DownloadCSV";
import DownloadJSON from "../utils/DownloadCSV/DownloadJSON";
import JobsToCSV from "../utils/DownloadCSV/JobsToCSV";

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

  console.log("ANTES", jobList.length);

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
        console.log("Despues", jobList.length);
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
    <>
      {loading ? (
        <Spinner color="primary" />
      ) : error !== null ? (
        AlertError
      ) : jobList ? (
        <Card elevation={6}>
          <CardContent>
            <CollapsibleTable
              rows={jobList}
              route={props.route}
              settings={props.settings}
              deleted={setDeleted}
            />
          </CardContent>
          <CardActions>
            <ButtonGroup>
              <JobsToCSV data={jobList} fileName={props.settings.title} />
            </ButtonGroup>
          </CardActions>
        </Card>
      ) : (
        <Typography color={"error"}> NO Data </Typography>
      )}
    </>
  );
};

export default FullJobsRender;
