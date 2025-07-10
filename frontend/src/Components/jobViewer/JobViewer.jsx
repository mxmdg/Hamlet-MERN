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
  const [useCurrentJob, setCurrentJob] = useState(props.job);
  const [useLoading, setLoading] = useState(props.job ? false : true);
  const [useError, setError] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (props.job !== undefined) {
      console.log("Usando trabajo cargado");
      setCurrentJob(props.job);
      setLoading(false);
      setError(null);
    } else {
      try {
        const fetchJob = async () => {
          const currentJob = await getPrivateElementByID(props.entity, id);
          console.log(currentJob);
          currentJob.data
            ? setCurrentJob(currentJob.data)
            : setError({ message: "Trabajo inexistente" });
          setLoading(false);
          console.log(currentJob.data);
        };
        fetchJob();
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
  }, [setCurrentJob, props.job, props.entity, id]);

  const preloader = (
    <>
      <Spinner />
    </>
  );

  const output = () => {
    if (useLoading === false && useCurrentJob !== null) {
      return <JobDetail job={useCurrentJob} cot={props.cot} />;
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
