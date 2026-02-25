import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Divider,
  Stack,
  Typography,
  Button,
  Card,
  CardHeader,
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ImpoProvider from "../utils/impo/ImpoContext";
import Canvas from "../utils/impo/Canvas";
import ImpositionDraw from "../utils/impo/ImpositionDraw";
import { calculateStock } from "../utils/impo/ImpositionService";
import DarkWoodCard from "../utils/DarkWoodCard";
import CopyToClipboardWrapper from "../General/CopyToClipboardWrapper";
import ColorSheetRangeGenerator from "../utils/generalData/ColorSheetRangeGenerator";
import FinishingList from "./FinishingList";
import { Item, Item2 } from "./StyledComponents"; // Sugerencia: mover estilos a un archivo aparte

const PartDetail = ({
  part,
  job,
  isCotization,
  onSaveImposition,
  onFinishingChange,
}) => {
  // Estados locales para que cada Tab maneje su propia lógica
  const [usePoses, setPoses] = useState(
    isCotization?.impositionData?.Poses || null,
  );
  const [useImpoData, setImpoData] = useState(
    isCotization?.impositionData[part._id]?.impositionData || null,
  );
  const [useData, setData] = useState(null);

  const [useSavedImpo, setSavedImpo] = useState(true);

  console.log(useImpoData, useSavedImpo);

  // Lógica de cálculo de stock (extraída de tu código original)
  const stockCalculated = useImpoData
    ? calculateStock(
        useImpoData.sheetOriginalSize.width,
        useImpoData.sheetOriginalSize.height,
        part.partStock.Ancho_Resma,
        part.partStock.Alto_Resma,
        part,
        job,
        usePoses,
      )
    : null;

  /*const stockCalculated = {
    cantidadDePliegos: 22,
    pliegosPorHoja: 3,
    totalHojas: 8,
  };*/

  useEffect(() => {
    if (isCotization) {
      setImpoData(isCotization?.impositionData[part._id]?.impositionData);
    }
    if (usePoses !== null && useImpoData) {
      setData({
        widthSheet: parseInt(part.partStock.Ancho_Resma),
        heightSheet: parseInt(part.partStock.Alto_Resma),
        widthPage: parseInt(
          isCotization.impositionData.sheetOriginalSize?.width,
        ),
        heightPage: parseInt(useImpoData?.sheetOriginalSize?.height),
        margenes: 0,
        Calle: 0,
      });
    }
  }, [setImpoData, setData, useSavedImpo]);

  const handleSave = () => {
    const partCosts = {
      id: part._id,
      Poses: usePoses,
      totalPliegos: stockCalculated?.cantidadDePliegos,
      totalHojas: stockCalculated?.totalHojas,
      tirada: Math.ceil(
        job.Cantidad > 1 ? job.Cantidad / usePoses : job.Cantidad,
      ),
      stock: part.partStock,
      colores: Math.max(part.ColoresFrente, part.ColoresDorso),
      impresiones: Math.ceil(
        stockCalculated.cantidadDePliegos * (part.ColoresDorso > 0 ? 2 : 1),
      ),
      impositionData: useImpoData,
    };
    onSaveImposition(part._id, partCosts);
    setSavedImpo(true);
  };

  return (
    <Box>
      <Grid
        container
        columns={12}
        spacing={2}
        sx={{
          m: 0,
          width: "100%",
          alignItems: "start", // Obliga a las columnas a medir lo mismo de alto
        }}
        direction={{ xs: "column", md: "row" }}
      >
        {/* Visualización de Imposición (Izquierda) */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ImpoProvider>
            <DarkWoodCard>
              <Canvas
                part={part}
                getPoses={setPoses}
                poses={usePoses}
                getSheet={setImpoData}
                sheet={useImpoData}
                save={setSavedImpo}
              />
            </DarkWoodCard>
          </ImpoProvider>
        </Grid>
        {/* Detalles y Acciones (Derecha) */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack spacing={1}>
            <Item>
              <strong>Tipo:</strong> {part.jobParts[0].Type}
            </Item>
            <Item>
              <strong>Formato:</strong> {part.Ancho} x {part.Alto} (
              {part.Orientacion})
            </Item>

            <Item2>
              <Typography variant="subtitle2" color="primary">
                Especificaciones de Material
              </Typography>
              <Typography variant="body2">
                {part.partStock.Nombre_Material}
              </Typography>
              {usePoses && (
                <Box mt={1}>
                  <Typography variant="caption" display="block">
                    Poses: {usePoses} | Tirada:{" "}
                    {Math.ceil(job.Cantidad / usePoses)}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Pliegos: {stockCalculated?.cantidadDePliegos}
                  </Typography>
                </Box>
              )}
            </Item2>

            {usePoses && (
              <>
                {useData && (
                  <Container maxHeight={"50%"}>
                    <ImpoProvider>
                      <Card variant="outlined" sx={{ mt: 1 }}>
                        <CardHeader
                          title="Corte de plana"
                          titleTypographyProps={{ variant: "caption" }}
                        />
                        <ImpositionDraw data={useData} />
                      </Card>
                    </ImpoProvider>
                  </Container>
                )}
                <Button
                  onClick={handleSave}
                  variant="contained"
                  color="success"
                  fullWidth={false}
                  startIcon={<SaveIcon />}
                  disabled={useSavedImpo}
                >
                  Guardar Imposición
                </Button>
              </>
            )}

            {part.Finishing && (
              <FinishingList
                finishing={part.Finishing}
                cantidad={job.Cantidad}
                paginas={part.Pages}
                imposition={useImpoData ? { Poses: usePoses } : null}
                sendFinishingData={(data) => onFinishingChange(part._id, data)}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PartDetail;
