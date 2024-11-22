import {
  Avatar,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Modal,
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
import MenuBookIcon from "@mui/icons-material/MenuBook";
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
import ImpositionDraw from "../utils/impo/ImpositionDraw";
import {
  bestCut,
  cutOptimizer,
  calculateStock,
} from "../utils/impo/ImpositionService";
import DarkWoodCard from "../utils/DarkWoodCard";

// Mis componentes
import JobRow from "../Jobs/jobsTable/JobRow";
import ProductionPlan from "./ProductionPlan";
import arrayNormalizer from "../utils/generalData/arrayNormalizer";

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
    color: theme.palette.text,
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
    const [imposed, setImposed] = useState(false);
    const [useData, setData] = useState(null);
    let partNumber = job.Partes.indexOf(part) + 1;
    let myKey = part._id + partNumber;

    const partCosts = {
      Poses: usePoses,
      ImpositionData: useImpoData,
    };

    const Finishing = arrayNormalizer(part.Finishing);

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
                <Stack spacing={2}>
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
                  <Item>
                    {part.partStock.Tipo} {part.partStock.Gramaje}{" "}
                    {useImpoData
                      ? ` - ${useImpoData.formatSelector.Nombre}`
                      : ""}
                  </Item>

                  {usePoses && (
                    <>
                      <Item2 elevation={4}>Poses: {usePoses}</Item2>
                      <Item2 elevation={4}>
                        Tirada: {Math.ceil(job.Cantidad / usePoses)}
                      </Item2>
                      <Item2 elevation={4}>
                        Pliegos: {stockCalculated.cantidadDePliegos} - Salen:{" "}
                        {stockCalculated.pliegosPorHoja} del{" "}
                        {part.partStock.Ancho_Resma} x{" "}
                        {part.partStock.Alto_Resma}
                      </Item2>
                      <Item2 elevation={4}>
                        Cantidad de resmas:{" "}
                        {Math.ceil((stockCalculated.totalHojas / 500) * 100) /
                          100}{" "}
                        {`(${stockCalculated.totalHojas} hojas)`}
                      </Item2>
                      {useData !== null && (
                        <ImpoProvider>
                          <ImpositionDraw data={useData} />
                        </ImpoProvider>
                      )}
                      <Button
                        //icon={ArrowBackIcon}
                        onClick={() => {
                          saveProductionPlan();
                        }}
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                      >
                        Guardar Imposicion
                      </Button>
                    </>
                  )}
                  {Finishing && (
                    <Item>
                      <List dense={true} disablePadding={true}>
                        {Finishing.map((pf) => {
                          return (
                            <ListItem divider={true} key={pf._id}>
                              <Typography color={"primary"}>
                                {pf.Proceso} / {pf.Modelo}
                              </Typography>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Item>
                  )}
                </Stack>
              </Grid>
              <Divider />
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
              variant="circle"
              sx={{
                backgroundColor: "#FFBA5A",
                boxShadow: "5px 5px 10px #00000066",
              }}
            >
              <MenuBookIcon color="error" />
            </Avatar>
          }
          action={
            <Button
              onClick={() => {
                navigate(`/jobs/copy/${job._id}`);
              }}
            >
              Editar
            </Button>
          }
          /*  action={
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
          } */
          title={
            job.Cantidad +
            " | " +
            job.Nombre +
            (job.Company ? ` - ${job.Company.Nombre}` : "")
          }
          subheader={
            job.Owner
              ? `${job.Owner.Name} ${job.Owner.LastName} - ${job.Owner.email}`
              : ""
          }
          te={job.Cantidad}
        />
        <CardContent>
          <Typography variant="title" fontSize={20} color={"secondary"}>
            Partes:{" "}
          </Typography>
          <Divider />
          {job.Partes.map((parte) => {
            return PartDetail(parte);
          })}
          {job.Finishing && (
            <Accordion
              key={"fn-" + productionPlan.id}
              id={"fn-" + productionPlan.id}
              expanded={expanded === "fn-" + productionPlan.id}
              onChange={handleChange("fn-" + productionPlan.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography color={"primary"}>Terminacion:</Typography>
              </AccordionSummary>
              <Card>
                <CardHeader subheader="Procesos" />
                <CardContent>
                  <List>
                    {job.Finishing.map((f) => {
                      return (
                        <ListItem key={"j" + f._id}>
                          <ListItemText>
                            <Typography>
                              {f.Proceso} / {f.Modelo}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Accordion>
          )}

          {productionPlanAvaible && (
            <Accordion
              key={"pp-" + productionPlan.id}
              id={"pp-" + productionPlan.id}
              expanded={expanded === "pp-" + productionPlan.id}
              onChange={handleChange("pp-" + productionPlan.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography color={"primary"}>Costo:</Typography>
              </AccordionSummary>
              <ProductionPlan impositionData={productionPlan} job={job} />
            </Accordion>
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
