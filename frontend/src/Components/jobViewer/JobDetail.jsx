import {
  Avatar,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Select,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { styled } from "@mui/material/styles";
import ReactTimeAgo from "react-time-ago";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Acordion Imports:
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Navigate, useNavigate } from "react-router-dom";

// Imposition imports
import { ImpoContext } from "../utils/impo/ImpoContext";
import ImpoProvider from "../utils/impo/ImpoContext";
import Canvas from "../utils/impo/Canvas";
import { bestCut, cutOptimizer } from "../utils/impo/ImpositionService";
import DarkWoodCard from "../utils/DarkWoodCard";

// Mis componentes
import JobRow from "../Jobs/jobsTable/JobRow";
import ProductionPlan from "./ProductionPlan";

export const calcularLomo = (pags, resma) => {
  return Math.ceil(Math.ceil(pags / 2) * (resma / 500));
};

const JobDetail = (props) => {
  const [expanded, setExpanded] = useState(false);
  const job = props.job;
  const navigate = useNavigate();
  // El siguiente estado es para almacenar la informacion de la imposicion en todas las partes.
  const [productionPlan, setProductionPlan] = useState({});
  const [productionPlanAvaible, setProductionPlanAvaible] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#222" : "#aaa",
    ...theme.typography.subtitle2,
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  const Item2 = styled(Paper)(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.info.dark
        : theme.palette.info.light,
    ...theme.typography.subtitle2,
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.success.contrastText,
  }));

  // Date Format Options:
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const showProductionPlan = () => {
    console.log(Object.keys(productionPlan), job.Partes.length);
    if (Object.keys(productionPlan).length === job.Partes.length) {
      setProductionPlanAvaible(true);
    } else {
      alert("Calcular la imposicion de todas las partes");
    }
  };

  const PartDetail = (part) => {
    const [usePoses, setPoses] = useState(null);
    const [useImpoData, setImpoData] = useState(null);
    let partNumber = job.Partes.indexOf(part) + 1;
    let myKey = part._id + partNumber;

    const partCosts = {
      Poses: usePoses,
      ImpositionData: useImpoData,
    };

    const saveProductionPlan = () => {
      partCosts.totalPliegos = calculateStock(
        useImpoData.formatSelector.Alto,
        useImpoData.formatSelector.Ancho,
        part.partStock.Ancho_Resma,
        part.partStock.Alto_Resma
      ).cantidadDePliegos;
      partCosts.totalHojas = calculateStock(
        useImpoData.formatSelector.Alto,
        useImpoData.formatSelector.Ancho,
        part.partStock.Ancho_Resma,
        part.partStock.Alto_Resma
      ).totalHojas;
      partCosts.tirada = Math.ceil(job.Cantidad / usePoses);
      partCosts.id = part._id;
      partCosts.stock = part.partStock;
      partCosts.impresiones =
        Math.ceil(part.Pages * (job.coloresDorso > 0 ? 2 : 1)) *
        Math.ceil(job.Cantidad / usePoses);
      setProductionPlan((prevState) => ({
        ...prevState,
        [part._id]: partCosts,
      }));
    };

    const calculateStock = (
      signnatureWidth,
      signatureHeight,
      sheetWidth,
      sheetHeight
    ) => {
      console.log(
        "Parametros recibidos ",
        signnatureWidth,
        signatureHeight,
        sheetWidth,
        sheetHeight
      );

      const straightCut = cutOptimizer(
        sheetWidth, //part.partStock.Ancho_Resma,
        sheetHeight, //part.partStock.Alto_Resma,
        parseInt(signnatureWidth), //useImpoData.width,
        parseInt(signatureHeight) //useImpoData.height
      );

      const rotatedtCut = cutOptimizer(
        sheetWidth, //part.partStock.Ancho_Resma,
        sheetHeight, //part.partStock.Alto_Resma,
        parseInt(signatureHeight), //useImpoData.height,
        parseInt(signnatureWidth) //useImpoData.width
      );

      const pliegosPorHoja = Math.max(
        parseInt(straightCut.totalPoses),
        parseInt(rotatedtCut.totalPoses)
      );

      const cantidadDePliegos =
        Math.ceil(part.Pages / (part.ColoresDorso > 0 ? 2 : 1)) *
        Math.ceil(job.Cantidad / usePoses);

      const totalHojas = Math.ceil(cantidadDePliegos / pliegosPorHoja);

      return { pliegosPorHoja, cantidadDePliegos, totalHojas };
    };

    return (
      <Box key={part._id}>
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
              spacing={0}
              alignItems={"start"}
            >
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Item>{part.jobParts[0].Type}</Item>
                  <Item>
                    Formato: {part.Ancho} x {part.Alto} - Orientacion:{" "}
                    {part.Orientacion}
                  </Item>
                  <Item>
                    Paginas: {part.Pages}
                    {part.jobParts[0].Type.includes("Interior" || "Insert") ? (
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
                  <Item>
                    Material: {part.partStock.Marca}, {part.partStock.Tipo},{" "}
                    {part.partStock.Gramaje}
                  </Item>
                  {usePoses && (
                    <>
                      <Item2 elevation={4}>Poses: {usePoses}</Item2>
                      <Item2 elevation={4}>
                        Tirada: {Math.ceil(job.Cantidad / usePoses)}
                      </Item2>
                      <Item2 elevation={4}>
                        Pliegos:{" "}
                        {
                          calculateStock(
                            useImpoData.formatSelector.Ancho,
                            useImpoData.formatSelector.Alto,
                            part.partStock.Ancho_Resma,
                            part.partStock.Alto_Resma
                          ).cantidadDePliegos
                        }{" "}
                        - Salen:{" "}
                        {
                          calculateStock(
                            useImpoData.formatSelector.Ancho,
                            useImpoData.formatSelector.Alto,
                            part.partStock.Ancho_Resma,
                            part.partStock.Alto_Resma
                          ).pliegosPorHoja
                        }{" "}
                        del {part.partStock.Ancho_Resma} x{" "}
                        {part.partStock.Alto_Resma}
                      </Item2>
                      <Item2 elevation={4}>
                        Cantidad de resmas:{" "}
                        {Math.ceil(
                          (calculateStock(
                            useImpoData.formatSelector.Ancho,
                            useImpoData.formatSelector.Alto,
                            part.partStock.Ancho_Resma,
                            part.partStock.Alto_Resma
                          ).totalHojas /
                            500) *
                            100
                        ) / 100}{" "}
                        {`(${
                          calculateStock(
                            useImpoData.formatSelector.Ancho,
                            useImpoData.formatSelector.Alto,
                            part.partStock.Ancho_Resma,
                            part.partStock.Alto_Resma
                          ).totalHojas
                        } hojas)`}
                      </Item2>
                      <Button
                        //icon={ArrowBackIcon}
                        onClick={() => {
                          saveProductionPlan();
                        }}
                        variant="contained"
                        color="success"
                        startIcon={<SaveIcon />}
                      >
                        Guardar Imposicion
                      </Button>
                    </>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={8}>
                <ImpoProvider>
                  <DarkWoodCard>
                    <Canvas
                      part={part}
                      getPoses={setPoses}
                      getSheet={setImpoData}
                    ></Canvas>
                  </DarkWoodCard>
                </ImpoProvider>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  return (
    <Container>
      <Card elevation={16}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: "#c3d", minWidth: "fit-content", padding: 1 }}
              variant="rounded"
            >
              {job.Cantidad}
            </Avatar>
          }
          action={
            <Box>
              <Paper elevation={12} sx={{ background: "#39a" }}>
                <Container sx={{ padding: "15px" }}>
                  <Typography variant="title" gutterBottom>
                    <b>
                      Emision:{" "}
                      {new Date(job.Fecha).toLocaleDateString(
                        undefined,
                        options
                      )}
                    </b>
                    <br />
                    <Divider />
                    <b>
                      Entrega:{" "}
                      {new Date(job.Entrega).toLocaleDateString(
                        undefined,
                        options
                      )}
                    </b>
                  </Typography>
                </Container>
                <Container>
                  <ErrorMessage
                    message={
                      <ReactTimeAgo
                        date={Date.parse(job.Entrega)}
                        locale="es-ES"
                      />
                    }
                    severity="warning"
                  />
                </Container>
              </Paper>
            </Box>
          }
          title={job.Nombre + (job.Company ? ` - ${job.Company.Nombre}` : "")}
          subheader={job.Owner ? `${job.Owner.Name} ${job.Owner.LastName}` : ""}
        />
        <CardContent>
          <h4>Partes: </h4>
          <Divider />
          {job.Partes.map((parte) => {
            return PartDetail(parte);
          })}
          {productionPlanAvaible && (
            <ProductionPlan impositionData={productionPlan} />
          )}
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            //icon={ArrowBackIcon}
            onClick={() => {
              navigate(-1);
            }}
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIcon />}
          >
            Volver
          </Button>
          <Button
            //icon={ArrowBackIcon}
            onClick={() => {
              showProductionPlan();
            }}
            variant="contained"
            color="primary"
          >
            Plan de producción
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default JobDetail;
