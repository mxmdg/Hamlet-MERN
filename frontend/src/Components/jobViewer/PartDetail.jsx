import React, { useEffect, useState } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Stack,
  Divider,
  Button,
  Card,
  CardHeader,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import DarkWoodCard from "../utils/DarkWoodCard";
import Canvas from "../utils/impo/Canvas";
import ImpositionDraw from "../utils/impo/ImpositionDraw";
import FinishingList from "./FinishingList";
import { styled } from "@mui/material/styles";
import { calcularLomo } from "./JobDetail";

// Imposition imports
import {
  bestCut,
  cutOptimizer,
  calculateStock,
} from "../utils/impo/ImpositionService";

const PartDetail = ({
  part,
  job,
  expanded,
  handleChange,
  setProductionPlan,
}) => {
  const [usePoses, setPoses] = useState(null);
  const [useImpoData, setImpoData] = useState(null);
  const [usePartFinishingData, setPartFinishingData] = useState(null);
  const [imposed, setImposed] = useState(false);
  const [useData, setData] = useState(null);
  const partNumber = job.Partes.indexOf(part) + 1;
  const myKey = part._id + partNumber;

  const partCosts = {
    Poses: usePoses,
    impositionData: useImpoData,
    finishingData: usePartFinishingData,
  };

  const Item = styled(Box)(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.success.dark
        : theme.palette.success.light,
    ...theme.typography.subtitle2,
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.primary,
  }));

  const Item2 = styled(Box)(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.info.dark
        : theme.palette.info.light,
    ...theme.typography.subtitle2,
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text,
  }));

  const stockCalculated = useImpoData
    ? calculateStock(
        useImpoData.sheetOriginalSize.width,
        useImpoData.sheetOriginalSize.height,
        part.partStock.Ancho_Resma,
        part.partStock.Alto_Resma,
        part,
        job,
        usePoses
      )
    : "";

  const saveProductionPlan = () => {
    partCosts.totalPliegos = stockCalculated.cantidadDePliegos;
    partCosts.totalHojas = stockCalculated.totalHojas;
    partCosts.tirada = Math.ceil(job.Cantidad / usePoses);
    partCosts.id = part._id;
    partCosts.stock = part.partStock;
    partCosts.colores = Math.max(part.ColoresFrente, part.ColoresDorso);
    partCosts.impresiones =
      Math.ceil(part.Pages * (job.coloresDorso > 0 ? 2 : 1)) *
      Math.ceil(job.Cantidad / usePoses);
    setProductionPlan((prevState) => ({
      ...prevState,
      [part._id]: partCosts,
    }));
  };

  useEffect(() => {
    if (usePoses !== null) {
      setImposed(true);
      setData({
        widthSheet: part.partStock.Ancho_Resma,
        heightSheet: part.partStock.Alto_Resma,
        widthPage: useImpoData.sheetOriginalSize.width,
        heightPage: useImpoData.sheetOriginalSize.height,
        margenes: 0,
        Calle: 0,
      });
    }
  }, [useImpoData, stockCalculated.cantidadDePliegos]);

  return (
    <Box key={part._id} mb={1}>
      <Accordion
        key={myKey}
        id={myKey}
        expanded={expanded === myKey}
        onChange={handleChange(myKey)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            {part.Name}
            <br /> {part.jobParts[0].Type}
          </Typography>
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Parte {partNumber} de {job.Partes.length}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Material: {part.partStock.Nombre_Material}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            sx={{ maxWidth: "100%", overflow: "auto" }}
            container
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={"start"}
          >
            <Grid item xs={12} md={4}>
              <Stack spacing={0.25} sx={{ p: "2px" }}>
                <Item>{part.jobParts[0].Type}</Item>
                <Item>
                  Formato: {part.Ancho} x {part.Alto} - Orientacion:{" "}
                  {part.Orientacion}
                </Item>
                <Item>
                  Paginas: {part.Pages}
                  {parseInt(part.Pages) > 10 ? (
                    <>
                      {" ("}Lomo:{" "}
                      {calcularLomo(part.Pages, part.partStock.Espesor_Resma)}{" "}
                      mm.
                      {")"}
                    </>
                  ) : (
                    ""
                  )}
                </Item>

                <Item>
                  Impresion: {part.ColoresFrente} / {part.ColoresDorso}
                </Item>
                <Item2>
                  <Typography variant="h6">
                    {part.partStock.Tipo} {part.partStock.Gramaje}{" "}
                    {useImpoData
                      ? ` - ${useImpoData.sheetOriginalSize.width} x ${
                          useImpoData.sheetOriginalSize.height
                        } ${
                          Math.max(part.ColoresFrente, part.ColoresDorso) > 1
                            ? "CMYK"
                            : "K"
                        }`
                      : ""}
                  </Typography>
                  {usePoses && (
                    <Typography variant="h6">
                      Poses: {usePoses} / Tirada:{" "}
                      {Math.ceil(job.Cantidad / usePoses)}
                      <br />
                      Pliegos: {stockCalculated.cantidadDePliegos} - Salen:{" "}
                      {stockCalculated.pliegosPorHoja} del{" "}
                      {part.partStock.Ancho_Resma} x {part.partStock.Alto_Resma}
                      <br />
                      Cantidad de resmas:{" "}
                      {Math.ceil((stockCalculated.totalHojas / 500) * 100) /
                        100}{" "}
                      {`(${stockCalculated.totalHojas} hojas)`}
                    </Typography>
                  )}
                </Item2>

                {usePoses && (
                  <>
                    {useData !== null && (
                      <Card elevation={10}>
                        <CardHeader
                          title="Corte de plana"
                          titleTypographyProps={{
                            variant: "subtitle2",
                          }}
                        />
                        <ImpositionDraw data={useData} />
                      </Card>
                    )}
                    <Button
                      onClick={() => {
                        saveProductionPlan();
                      }}
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                    >
                      Guardar Imposición
                    </Button>
                  </>
                )}
                {part.Finishing && (
                  <Item>
                    <FinishingList
                      finishing={part.Finishing}
                      cantidad={job.Cantidad}
                      imposition={
                        useImpoData !== null ? partCosts : "Guardar Imposición"
                      }
                      sendFinishingData={setPartFinishingData}
                    />
                  </Item>
                )}
              </Stack>
            </Grid>
            <Divider />
            <Grid item xs={12} md={8}>
              <DarkWoodCard>
                <Canvas
                  part={part}
                  getPoses={setPoses}
                  getSheet={setImpoData}
                ></Canvas>
              </DarkWoodCard>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PartDetail;
