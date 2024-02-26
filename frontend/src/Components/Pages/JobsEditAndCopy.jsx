import React from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Spinner from "../General/Spinner";
import JobRow from "../Jobs/jobsTable/JobRow";
import {
  fechtData,
  getPrivateElements,
  getPrivateElementByID,
} from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MyStepper from "../Jobs/Stepper";

const JobsEditAndCopy = () => {
  const [useJob, setJob] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const params = useParams();

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

  /* const JobListRender = () => {
    return (
      <>
        {jobList.length > 1 &&
          jobList.map((item) => {
            return <JobRow job={item} key={item._id} />;
          })}
      </>
    );
  }; */

  React.useEffect(() => {
    const { id } = params;

    const getItem = async () => {
      try {
        const res = await getPrivateElementByID("jobs", id);
        setJob(res.data);
        setError(null);
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
        return;
      }
    };
    getItem();
  }, [setJob]);

  return (
    <Container>
      {loading ? (
        <Spinner color="primary" />
      ) : error !== null ? (
        AlertError
      ) : useJob ? (
        <MyStepper job={useJob} />
      ) : (
        <Typography color={"error"}> NO Data </Typography>
      )}
    </Container>
  );
};

export default JobsEditAndCopy;
