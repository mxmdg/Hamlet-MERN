import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import JobsForm from "./JobsForm";
import JobParts from "./JobsParts";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {
  Divider,
  ButtonGroup,
  Grid,
  Container,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  getPrivateElementByID,
  addPrivateElement,
  putPrivateElement,
  fechtData,
} from "../customHooks/FetchDataHook";
import { serverURL, HAMLET_API } from "../Config/config";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// ---------------------------------------------------------------------------
// CAMBIO 1: normalizeImportedJob
//
// Objetivo: convertir las Partes de un trabajo importado (Papyrus u otra
// fuente) al mismo formato que usa el stepper internamente, pero marcando
// cada parte con `_needsMapping: true` para que JobsParts sepa que el
// usuario debe seleccionar el tipo de parte y el material manualmente.
//
// Los campos de texto (Name, Ancho, Alto, Pages, etc.) se conservan para
// que el formulario los precargue. Solo se limpian `jobParts` y `partStock`
// porque esos son los valores que dependen de IDs válidos en MongoDB.
// ---------------------------------------------------------------------------
const normalizeImportedJob = (job) => {
  if (!job || !Array.isArray(job.Partes)) return job;

  const normalizedPartes = job.Partes.map((parte) => {
    // Si la parte ya tiene un jobParts poblado con _id válido, no la tocamos.
    const hasValidJobPart =
      Array.isArray(parte.jobParts) &&
      parte.jobParts.length > 0 &&
      parte.jobParts[0]?._id;

    if (hasValidJobPart) return parte;

    // Parte importada: limpiamos las referencias a IDs y marcamos _needsMapping.
    return {
      ...parte,
      jobParts: [],       // sin referencia a colección BD → selector vacío
      partStock: null,    // sin material preseleccionado
      _needsMapping: true, // bandera para JobsParts
    };
  });

  return { ...job, Partes: normalizedPartes };
};

const JobStepper = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [allParts, setAllParts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [useError, setError] = useState(null);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  // CAMBIO 2: al inicializar, normalizamos el trabajo entrante.
  // Si viene de MongoDB, normalizeImportedJob no toca nada (hasValidJobPart=true).
  // Si viene de Papyrus, marca las partes sin jobParts como _needsMapping.
  const normalizedJob = props.job ? normalizeImportedJob(props.job) : null;

  const [useParts, setParts] = useState(normalizedJob?.Partes || []);
  const [usePartToEdit, setPartToEdit] = useState(null);
  const [useJobType, setJobType] = useState(props.job?.Tipo[0] || {});
  const [useJob, setJob] = useState(normalizedJob || null);

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
  };

  const addParts = (newPart) => {
    try {
      const getStock = async (id) => {
        const stock = await getPrivateElementByID("materiales", id);
        newPart.partStock = stock.data;
      };
      getStock(newPart.partStock);
    } catch (e) {
      setError(e);
    }
    const part = allParts.filter((part) => part._id === newPart.jobParts);
    newPart.jobParts = part;

    let partes = [...useParts];
    partes.push(newPart);

    try {
      setParts(partes);
      handleNext();
    } catch (e) {
      setError(e);
    }
  };

  const removePart = (n) => {
    const partsOk = useParts.filter((_, index) => index !== n);
    setParts(partsOk);
  };

  const replacePart = (newPart) => {
    try {
      const getStock = async (id) => {
        const stock = await getPrivateElementByID("materiales", id);
        newPart.partStock = stock.data;
      };
      getStock(newPart.partStock);
    } catch (e) {
      setError(e);
    }
    const part = allParts.filter((part) => part._id === newPart.jobParts);
    newPart.jobParts = part;

    // CAMBIO 3: al guardar la parte editada, eliminamos _needsMapping.
    // La parte ya fue mapeada correctamente por el usuario.
    const { _needsMapping, ...cleanPart } = newPart;

    const partsOk = useParts.map((part, index) =>
      index === usePartToEdit.index ? cleanPart : part
    );
    setPartToEdit(null);
    setParts(partsOk);
    handleNext();
  };

  const editPart = (n) => {
    setPartToEdit({ part: useParts[n], index: n });
  };

  const isStepOptional = (step) => step === 1;
  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetError = () => {
    setError(null);
    handleBack();
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handlePost = async () => {
    const Job = { ...useJob, Partes: useParts, Tipo: useJobType };
    try {
      await addPrivateElement("Jobs", Job);
      handleNext();
    } catch (e) {
      setError(e);
    }
  };

  const handleUpdate = async () => {
    const Job = { ...useJob, Partes: useParts };
    try {
      await putPrivateElement(`${HAMLET_API}jobs/${props.job._id}`, Job);
      handleNext();
    } catch (e) {
      setError(e);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    const reset = props.job ? normalizeImportedJob(props.job) : null;
    setParts(reset?.Partes || []);
    setJobType(props.job?.Tipo[0] || {});
    setJob(reset || null);
  };

  // CAMBIO 4: el step de confirmación indica si hay partes pendientes de
  // mapeo (_needsMapping) para alertar al usuario antes de enviar.
  const pendingMappingCount = useParts.filter((p) => p._needsMapping).length;

  const steps = [
    [
      "Defina el tipo de producto",
      <JobsForm
        jobType={useJobType}
        setJobType={setJobType}
        data={useJob}
        setJob={setJob}
        continue={handleNext}
      />,
    ],
    [
      "Agregue las partes",
      <JobParts
        jobType={useJobType}
        job={useJob}
        addParts={addParts}
        replacePart={replacePart}
        editPart={usePartToEdit}
        setEditPart={setPartToEdit}
        useParts={useParts}
        parts={allParts}
        stocks={stocks}
      />,
    ],
    [
      "Confirme el pedido",
      <Box>
        {pendingMappingCount > 0 && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "warning.light",
              border: "1px solid",
              borderColor: "warning.main",
            }}
          >
            <Typography variant="body2" color="warning.dark" fontWeight={500}>
              ⚠ {pendingMappingCount} parte{pendingMappingCount > 1 ? "s" : ""}{" "}
              importada{pendingMappingCount > 1 ? "s" : ""} sin tipo de parte
              asignado. Volvé al paso anterior y editá cada parte marcada con{" "}
              <strong>Importada</strong> para seleccionar el tipo de parte y el
              material correctamente antes de enviar.
            </Typography>
          </Box>
        )}
        <Typography variant="subtitle1">Partes del trabajo</Typography>
        <List sx={{ listStyleType: "bullet" }}>
          {useParts.map((part, index) => (
            <ListItem
              divider
              key={`${index}-Parte_${part.Finishing?.length}`}
              secondaryAction={
                part._needsMapping ? (
                  <Chip label="Importada" color="warning" size="small" />
                ) : null
              }
            >
              <ListItemText
                sx={{ display: "list-item" }}
                primary={part.Name}
                secondary={
                  part._needsMapping
                    ? "Sin tipo de parte asignado — editá esta parte"
                    : `${part.partStock?.Tipo || ""} ${part.partStock?.Gramaje || ""} ${part.partStock?.Marca || ""}`
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>,
    ],
  ];

  useEffect(() => {
    try {
      fechtData("jobParts", setAllParts);
      fechtData("materiales", setStocks);
    } catch (error) {
      setError(error);
    }
  }, [useJob, usePartToEdit]);

  const statusOk = (
    <Box sx={{ width: "100%", padding: "2%" }}>
      <Card raised sx={{ gap: "20px" }} color="info">
        <CardHeader
          title={useJob?.Nombre || "Nuevo Pedido"}
          subheader={useJob?.Cantidad || "Solicita tu presupuesto!"}
          action={
            <Button onClick={() => navigate(-1)}>Volver</Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid
            container
            columns={12}
            sx={{ width: "100%", display: "flex", flexDirection: "row" }}
          >
            <Grid>
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography variant="caption" key={index}>
                        Opcional
                      </Typography>
                    );
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={index + "_label"} {...stepProps}>
                      <StepLabel {...labelProps}>{label[0]}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    Todos los pasos completados.
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset} variant="filled">
                      Reset
                    </Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    Paso {activeStep + 1}
                  </Typography>
                  {steps[activeStep][1]}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      p: 2,
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    <ButtonGroup variant="outlined">
                      <Button
                        color="success"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                      >
                        {activeStep < steps.length - 1
                          ? "Modificar Datos del Trabajo"
                          : "Agregar más partes"}
                      </Button>
                      {isStepOptional(activeStep) && (
                        <Button color="info" onClick={handleSkip}>
                          Saltar
                        </Button>
                      )}
                      <Button
                        onClick={
                          activeStep === steps.length - 1
                            ? handlePost
                            : handleNext
                        }
                        color="info"
                        disabled={useJob === null}
                      >
                        {activeStep === steps.length - 1
                          ? "Enviar Nuevo Pedido"
                          : "Siguiente"}
                      </Button>
                      {props.job !== undefined &&
                        activeStep === steps.length - 1 && (
                          <Button onClick={handleUpdate} color="warning">
                            Guardar
                          </Button>
                        )}
                    </ButtonGroup>
                  </Box>
                  <Divider />
                </React.Fragment>
              )}
            </Grid>

            <Grid sx={{ ml: 2 }} size={{ xs: 12, md: 12, lg: 12 }}>
              <Container>
                <Grid
                  container
                  columns={12}
                  spacing={1}
                  overflow={"false"}
                  sx={{ height: "98%" }}
                >
                  {useParts?.map((part, index) => (
                    <Grid key={"Parte-" + index} size={{ xs: 12, sm: 12, md: 12 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                          Parte {index + 1}: {part.Name}
                        </Typography>
                        {part._needsMapping && (
                          <Chip
                            label="Importada — requiere revisión"
                            color="warning"
                            size="small"
                            onClick={() => {
                              editPart(index);
                              setActiveStep(1);
                            }}
                            sx={{ cursor: "pointer" }}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const statusError = (
    <>
      {useError !== null && (
        <ErrorMessage
          message={useError.response?.data?.message || useError.message}
          color="success"
          action={resetError}
        />
      )}
    </>
  );

  return useError !== null ? statusError : statusOk;
};

export default JobStepper;
