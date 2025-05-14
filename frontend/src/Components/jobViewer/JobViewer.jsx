import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Spinner from "../General/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import JobDetail from "./JobDetail";

import {
  addPrivateElement,
  getPrivateElments,
  getPrivateElementByID,
  putPrivateElement,
  deletePrivateElement,
} from "../customHooks/FetchDataHook";
import { Container, Box } from "@mui/material";

export const JobViewer = (props) => {
  const [useCurrentJob, setCurrentJob] = useState(props.job || null);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const currentJob = await getPrivateElementByID(props.entity, id);
        console.log(currentJob);
        currentJob.data
          ? setCurrentJob(currentJob.data)
          : setError({ message: "Trabajo inexistente" });
        setLoading(false);
        console.log(currentJob.data);
      } catch (e) {
        setError(e);
        setLoading(false);
        console.log(e);
      }
    };
    fetchJob();
  }, [setCurrentJob]);

  const preloader = (
    <>
      <Spinner />
    </>
  );

  const output = () => {
    if (useLoading === false && useCurrentJob !== null) {
      return <JobDetail job={useCurrentJob} />;
    } else {
      return preloader;
    }
  };

  return (
    <Box
      sx={{
        padding: 0,
        height: "100%",
        width: "100%",
      }}
    >
      {useError ? <ErrorMessage message={useError.message} /> : output()}
    </Box>
  );
};
