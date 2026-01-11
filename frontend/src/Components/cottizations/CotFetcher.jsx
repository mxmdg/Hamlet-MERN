import React from "react";
import { useState, useEffect } from "react";
import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import { useParams } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import CotizacionCard from "./CotizacionCard";
import { JobViewer } from "../jobViewer/JobViewer";

const CotFetcher = () => {
  const [cotizacion, setCotizacion] = useState(null);
  const [useJob, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = useParams();

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const data = await getPrivateElementByID("quotations", id.id);
        setCotizacion(data);
        const jobData = await getPrivateElementByID("jobs", data.jobId);
        setJob(jobData);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchCotizacion();
  }, [id]);

  if (error) {
    return (
      <ErrorMessage
        message={error.message || "Error al obtener la cotización"}
        error={error}
        action={() => setError(null)}
        severity="error"
        title="Error"
      />
    );
  }

  if (!cotizacion) {
    return (
      <div>
        {loading ? (
          <Spinner />
        ) : (
          <ErrorMessage
            message="No se encontró la cotización"
            severity="warning"
          />
        )}
      </div>
    );
  }

  return <CotizacionCard cotizacion={cotizacion} job={useJob} />;
};
export default CotFetcher;
