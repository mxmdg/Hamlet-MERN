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
  ButtonGroup,
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
// Acordion Imports:
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

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
import ProductionPlan from "./ProductionPlan";
import FinishingList from "./FinishingList";
import CopyToClipboardWrapper from "../General/CopyToClipboardWrapper";
import Spinner from "../General/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Mis hooks
import { getPrivateElements } from "../customHooks/FetchDataHook";
import { getMyDate } from "../utils/generalData/fechaDiccionario";
import ColorSheetRangeGenerator from "../utils/generalData/ColorSheetRangeGenerator";

export const calcularLomo = (pags, resma) => {
  return Math.ceil(Math.ceil(pags / 2) * (resma / 500));
};

/**
 * ⚠️ COMPLEX COMPONENT WARNING
 *
 * JobDetail maneja:
 * - visualización de Job
 * - imposición
 * - cotizaciones (snapshot histórico)
 * - plan de producción
 * - cálculo de materiales
 *
 * Este componente mezcla modos "edit" y "quotation".
 * Funciona, pero NO es mantenible.
 *
 * TODO (future):
 * - separar JobViewModel
 * - dividir en subcomponentes
 * - congelar cotización
 */

const JobDetail = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [job, setJob] = useState(props.job);
  const navigate = useNavigate();
  // El siguiente estado es para almacenar la informacion de la imposicion en todas las partes.
  const [stockRequired, setStockRequired] = useState(
    props.cot ? props.cot.impositionData : [],
  );

  const [useLoading, setLoading] = useState(false);
  const [useError, setError] = useState(null);

  const [productionPlan, setProductionPlan] = useState(
    props.cot ? props.cot.impositionData : {},
  );
  const [productionPlanAvaible, setProductionPlanAvaible] = useState(false);
  const [useJobFinishingData, setJobFinishingData] = useState(
    props.cot ? props.cot.finishing : null,
  );
  const [usePartFinishingData, setPartFinishingData] = useState(
    props.cot ? props.cot.partsFinishing : [],
  );
  const [previousCotizations, setPreviousCotizations] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.primary.dark
        : theme.palette.primary.light,
    ...theme.typography.subtitle2,
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.primary,
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
    if (
      Object.keys(productionPlan).length === job.Partes.length &&
      usePartFinishingData.length === job.Partes.length
    ) {
      setProductionPlanAvaible(true);
    } else {
      alert("Calcular la imposicion de todas las partes");
    }
  };

  const sumTotalPartsFinishingCosts = () => {
    let total = 0;
    usePartFinishingData.forEach((item) => {
      total += item.finishingData;
    });
    return total;
  };

  const PartDetail = (part) => {
    const [usePoses, setPoses] = useState(
      props.cot ? props.cot?.impositionData[part._id]?.Poses : null,
    );
    const [useImpoData, setImpoData] = useState(
      props.cot ? props.cot?.impositionData[part._id]?.impositionData : null,
    );
    const [imposed, setImposed] = useState(props.cot ? true : false);
    const [useData, setData] = useState(null);
    let partNumber = job.Partes.indexOf(part) + 1;
    let myKey = part._id + partNumber;

    const Finishing = part.Finishing;

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
      : "";

    const partCosts = {
      Poses: usePoses,
      totalPliegos: stockCalculated.cantidadDePliegos,
      impositionData: useImpoData,
      //finishingData: usePartFinishingData,
    };

    const saveProductionPlan = () => {
      partCosts.totalPliegos = stockCalculated.cantidadDePliegos;
      partCosts.totalHojas = stockCalculated.totalHojas;
      partCosts.tirada = Math.ceil(
        job.Cantidad > 1 ? job.Cantidad / partCosts.Poses : job.Cantidad,
      );
      partCosts.id = part._id;
      partCosts.stock = part.partStock;
      partCosts.colores = Math.max(part.ColoresFrente, part.ColoresDorso);
      partCosts.impresiones = Math.ceil(
        partCosts.totalPliegos * (part.ColoresDorso > 0 ? 2 : 1),
      );

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
          widthPage: parseInt(useImpoData?.sheetOriginalSize?.width),
          heightPage: parseInt(useImpoData?.sheetOriginalSize?.height),
          margenes: 0,
          Calle: 0,
        });
        setStockRequired(`
                        Poses: ${usePoses} / Tirada: ${Math.ceil(
                          job.Cantidad / usePoses,
                        )}
                        Pliegos: ${
                          stockCalculated.cantidadDePliegos
                        } - Salen: ${stockCalculated.pliegosPorHoja} del 
                        ${part.partStock.Ancho_Resma} x 
                        ${part.partStock.Alto_Resma}
                        Cantidad de resmas: 
                        ${
                          Math.ceil((stockCalculated.totalHojas / 500) * 100) /
                          100
                        } 
                        (${stockCalculated.totalHojas} hojas)
          `);
      }
    }, [
      useImpoData,
      usePoses,
      stockCalculated.cantidadDePliegos,
      setPartFinishingData,
      props.cot,
    ]);

    const loading = <Spinner title="Cargando informacion del trabajo" />;

    const failure = (
      <ErrorMessage message={useError} action={() => setError(null)} />
    );

    const success = (
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
              <Grid item xs={12} md={8}>
                <ImpoProvider>
                  <DarkWoodCard>
                    <Canvas
                      part={part}
                      getPoses={setPoses}
                      poses={usePoses}
                      getSheet={setImpoData}
                      sheet={useImpoData}
                    ></Canvas>
                  </DarkWoodCard>
                </ImpoProvider>
              </Grid>
              <Divider />
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
                    <CopyToClipboardWrapper
                      text={
                        usePoses
                          ? `${part.partStock.Nombre_Material} ${
                              useImpoData
                                ? `- ${useImpoData.sheetOriginalSize.width} x ${
                                    useImpoData.sheetOriginalSize.height
                                  } ${
                                    Math.max(
                                      part.ColoresFrente,
                                      part.ColoresDorso,
                                    ) > 1
                                      ? "CMYK"
                                      : "K"
                                  }`
                                : ""
                            }\nPoses: ${usePoses} / Tirada: ${Math.ceil(
                              job.Cantidad / usePoses,
                            )}\nPliegos: ${
                              stockCalculated.cantidadDePliegos
                            } - Salen: ${stockCalculated.pliegosPorHoja} del ${
                              part.partStock.Ancho_Resma
                            } x ${
                              part.partStock.Alto_Resma
                            }\nCantidad de resmas: ${
                              Math.ceil(
                                (stockCalculated.totalHojas / 500) * 100,
                              ) / 100
                            } (${stockCalculated.totalHojas} hojas)`
                          : `${part.partStock.Tipo} ${part.partStock.Gramaje}`
                      }
                    >
                      <Typography variant="h6">
                        {part.partStock.Nombre_Material} {"("}
                        {part.partStock.Tipo} {part.partStock.Gramaje}
                        {")"}
                        {useImpoData
                          ? ` - ${useImpoData.sheetOriginalSize.width} x ${
                              useImpoData.sheetOriginalSize.height
                            } ${
                              Math.max(part.ColoresFrente, part.ColoresDorso) >
                              1
                                ? "CMYK"
                                : "K"
                            }`
                          : ""}
                      </Typography>
                      {usePoses && (
                        <Box>
                          <Typography
                            variant="h6"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {`Poses: ${usePoses} / Tirada: ${Math.ceil(
                              job.Cantidad / usePoses,
                            )}\nPliegos: ${
                              stockCalculated.cantidadDePliegos
                            } - Salen: ${stockCalculated.pliegosPorHoja} del ${
                              part.partStock.Ancho_Resma
                            } x ${
                              part.partStock.Alto_Resma
                            }\nCantidad de resmas: ${
                              Math.ceil(
                                (stockCalculated.totalHojas / 500) * 100,
                              ) / 100
                            } (${stockCalculated.totalHojas} hojas)`}
                          </Typography>
                        </Box>
                      )}
                    </CopyToClipboardWrapper>
                  </Item2>

                  {usePoses && (
                    <>
                      {useData !== null && (
                        <ImpoProvider>
                          <Card elevation={10}>
                            <CardHeader
                              title="Corte de plana"
                              titleTypographyProps={{
                                variant: "subtitle2",
                              }}
                            />
                            <ImpositionDraw data={useData} />
                          </Card>
                        </ImpoProvider>
                      )}
                      <Button
                        //icon={ArrowBackIcon}
                        onClick={() => {
                          saveProductionPlan();
                        }}
                        variant="contained"
                        color="success"
                        startIcon={<SaveIcon />}
                      >
                        Guardar Imposición
                      </Button>
                    </>
                  )}
                  <ColorSheetRangeGenerator />
                  {part.Finishing && (
                    <Item>
                      <FinishingList
                        finishing={part.Finishing}
                        cantidad={job.Cantidad}
                        paginas={part.Pages}
                        imposition={
                          useImpoData !== null
                            ? partCosts
                            : "Guardar Imposición"
                        }
                        sendFinishingData={(finishingData) => {
                          setPartFinishingData((prevData) => {
                            const existingIndex = prevData.findIndex(
                              (item) => item.partId === part._id,
                            );
                            const updatedData = {
                              partId: part._id,
                              finishingData,
                            };
                            if (existingIndex !== -1) {
                              // Reemplazar el costo existente
                              const newData = [...prevData];
                              newData[existingIndex] = updatedData;
                              return newData;
                            } else {
                              // Agregar un nuevo costo
                              return [...prevData, updatedData];
                            }
                          });
                        }}
                      />
                    </Item>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    );

    return useLoading ? loading : useError ? failure : success;
  };

  useEffect(() => {
    const fetchPreviousCotizations = async () => {
      try {
        const previousCotizations = await getPrivateElements(
          `quotations/?P=jobId&Q=${job._id}`,
        );
        setPreviousCotizations(previousCotizations);
      } catch (error) {
        setError({
          message: "Error al cargar los datos de la cotización: " + error,
        });
      }
    };

    fetchPreviousCotizations();
  }, [setJobFinishingData, setPartFinishingData, setPreviousCotizations]);

  return (
    <Container>
      <Card elevation={16}>
        <CardHeader
          /* avatar={
            <Avatar
              variant="circle"
              sx={{
                backgroundColor: "#FFBA5A",
                boxShadow: "5px 5px 10px #00000066",
              }}
            >
              <MenuBookIcon color="success" />
            </Avatar>
          } */
          action={
            <Button
              onClick={() => {
                navigate(`/jobs/copy/${props.job._id}`);
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
            job.Nombre +
            " | " +
            (job.Company ? `${job.Company.Nombre}` : "") +
            " | " +
            "Cantidad: " +
            job.Cantidad
          }
          subheader={
            job.Owner
              ? `${job.Owner.Name} ${job.Owner.LastName} - ${job.Owner.email}`
              : ""
          }
          titleTypographyProps={{ variant: "h5" }}
          subheaderTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          {previousCotizations.length > 0 && (
            <>
              <ButtonGroup variant="text" size="small" orientation="vertical">
                <Typography variant="button">Pesupuestos: </Typography>
                {previousCotizations
                  .sort((a, b) => a - b)
                  .map((cotizacion) => (
                    <Button
                      color={
                        cotizacion.status.includes("Aprobad")
                          ? "success"
                          : cotizacion.status.includes("Rechazad")
                            ? "error"
                            : "primary"
                      }
                      //variant={cotizacion.status === "Aprobada" ? "contained" : cotizacion.status === "Rechazada" ? "contained" : "outlined"}
                      key={cotizacion._id}
                      onClick={() =>
                        navigate(`/quotations/edit/${cotizacion._id}`)
                      }
                    >
                      <b># {cotizacion.index} </b> -{" "}
                      {getMyDate(cotizacion.fecha).ddmmyy}
                    </Button>
                  ))}
              </ButtonGroup>
            </>
          )}
          <Typography variant="h6" fontSize={20} color={"secondary"}>
            Partes:{" "}
          </Typography>
          <Divider />
          {job.Partes.map((parte) => {
            return PartDetail(parte);
          })}
          {job.Finishing && (
            <Item>
              <FinishingList
                finishing={job.Finishing}
                cantidad={job.Cantidad}
                sendFinishingData={setJobFinishingData}
              />
            </Item>
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
              <ProductionPlan
                impositionData={productionPlan}
                job={job}
                finishingData={useJobFinishingData}
                partFinishingData={usePartFinishingData}
                totalFinishingCosts={
                  useJobFinishingData + sumTotalPartsFinishingCosts()
                }
                {...(props.cot
                  ? { quoteOptions: props.cot.quoteSettings }
                  : null)}
              />
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
            color="success"
          >
            Plan de producción
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default JobDetail;
