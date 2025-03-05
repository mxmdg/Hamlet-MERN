import React, { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getPrivateElementByID,
  putPrivateElement,
  addPrivateElement,
} from "../customHooks/FetchDataHook";
import Spinner from "../General/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const JobContext = createContext();

const JobProvider = ({ children }) => {
  const [job, setJob] = useState(null);
  const [jobType, setJobType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;

  const getJob = async (id) => {
    try {
      const job = await getPrivateElementByID("jobs", id);
      setJob(job);
      setJobType(job.data.Tipo);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getJob(id);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <JobContext.Provider value={{ job, setJob, jobType, setJobType }}>
      {children}
    </JobContext.Provider>
  );
};

export { JobProvider, JobContext };
