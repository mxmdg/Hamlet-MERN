// jobViewerV2/JobView.jsx
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useJob } from "./hooks/useJob";
import {
  Alert,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Stack,
} from "@mui/material";
import PartsList from "./components/PartsList";
import { sendXML } from "../utils/Extensions/ApogeeSendXML";

import FinishingListAuto from "../jobViewer/FinishingListAuto";

const JobView = (props) => {
  const { id } = useParams();
  const { job, loading, error } = useJob({ job: props.job, id, entity: props.entity });
  const [impositionData, setImpositionData] = useState(job?.ImpositionData || {});
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const [, setJobFinishingData] = useState(
      props.cot ? props.cot.finishing : null,
    );

  useEffect(() => {
    setImpositionData(job?.ImpositionData || {});
  }, [job?.ImpositionData]);


  if (loading) return <Spinner />;
  if (error) return <ErrorMessage title="Error" message={error.message} />;

  const partes = job?.Partes || [];
  const canExportJdf =
    partes.length > 0 &&
    partes.every((part) => {
      const savedImposition = impositionData[part._id];
      const settings = savedImposition?.impositionData || savedImposition;
      return (
        Number(part?.Ancho) > 0 &&
        Number(part?.Alto) > 0 &&
        Number(settings?.sheetOriginalSize?.width) > 0 &&
        Number(settings?.sheetOriginalSize?.height) > 0 &&
        Boolean(settings?.printerSelector?.Modelo)
      );
    });

  const handleExportJdf = async () => {
    const index = window.prompt("Ingresá el índice para el archivo JDF:");
    if (index === null) return;
    if (!index.trim()) {
      window.alert("El índice es obligatorio para generar el archivo JDF.");
      return;
    }

    setIsExporting(true);
    setExportError(null);
    try {
      const exportImpositionData = Object.fromEntries(
        Object.entries(impositionData).map(([partId, savedImposition]) => [
          partId,
          savedImposition?.impositionData
            ? savedImposition
            : { ...savedImposition, impositionData: savedImposition },
        ]),
      );
      await sendXML(job, {
        index: index.trim(),
        data: { impositionData: exportImpositionData },
      });
    } catch (error) {
      setExportError(
        error.response?.data?.message ||
          error.message ||
          "Error al generar el archivo JDF.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Presentación mínima por ahora — solo confirmamos que el trabajo llegó.
  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader title={job?.Nombre ?? "Trabajo sin nombre"} subheader={`Cantidad ${job?.Cantidad} -  ${job?.Company?.Nombre}`} />
        <CardContent>
            <PartsList
              partes={partes}
              impoData={impositionData}
              cantidad={job?.Cantidad}
              onImpositionChange={(partId, data) => {
                if (!partId) return;
                setImpositionData((currentData) => ({
                  ...currentData,
                  [partId]: data,
                }));
              }}
            />
            <FinishingListAuto finishing={job?.Finishing} cantidad={job?.Cantidad} sendFinishingData={setJobFinishingData} />
            <Stack spacing={1} sx={{ mt: 2, alignItems: "flex-end" }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} sm={3}>
                <Button
                variant="contained"
                color="secondary"
                onClick={handleExportJdf}
                disabled={!canExportJdf || isExporting}
              >
                {isExporting ? "Generando JDF..." : "Exportar JDF"}
              </Button>
              {!canExportJdf && (
                <Alert severity="info">
                  Realizá la imposición de todas las partes para habilitar la exportación.
                </Alert>
              )}
              {exportError && <Alert severity="error">{exportError}</Alert>}
              </Grid>
              </Grid>
              
            </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobView;