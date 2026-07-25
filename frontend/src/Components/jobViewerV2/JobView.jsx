// jobViewerV2/JobView.jsx
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useJob } from "./hooks/useJob";
import { Box, Card, CardContent, Typography, CardHeader } from "@mui/material";
import { getMyDate } from "../utils/generalData/fechaDiccionario";
import PartsList from "./components/PartsList";

import FinishingListAuto from "../jobViewer/FinishingListAuto";

const JobView = (props) => {
  const { id } = useParams();
  const { job, loading, error } = useJob({ job: props.job, id, entity: props.entity });
  const [useJobFinishingData, setJobFinishingData] = useState(
      props.cot ? props.cot.finishing : null,
    );

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage title="Error" message={error.message} />;

  // Presentación mínima por ahora — solo confirmamos que el trabajo llegó.
  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader title={job?.Nombre ?? "Trabajo sin nombre"} subheader={`Cantidad ${job?.Cantidad} -  ${job?.Company?.Nombre}`} />
        <CardContent>
            <PartsList partes={job?.Partes} impoData={job?.ImpositionData} cantidad={job?.Cantidad} />
            <FinishingListAuto finishing={job?.Finishing} cantidad={job?.Cantidad} sendFinishingData={setJobFinishingData} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobView;