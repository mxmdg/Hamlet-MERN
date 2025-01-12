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
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import {
  Divider,
  ButtonGroup,
  Grid,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  getPrivateElementByID,
  addPrivateElement,
  putPrivateElement,
  fechtData,
} from "../customHooks/FetchDataHook";

import { serverURL, databaseURL } from "../Config/config";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import PartCard from "./PartCard";

const JobStepper = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [allParts, setAllParts] = useState([]);
  const [useParts, setParts] = useState(props.job?.Partes || []);
  const [usePartToEdit, setPartToEdit] = useState(null);
  const [useJobType, setJobType] = useState(props.job?.Tipo[0] || {});
  const [useJob, setJob] = useState(props.job || null);
  const [useError, setError] = useState(null);
  const [stocks, setStocks] = useState([]);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

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

    let partes = useParts;
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

    const partsOk = useParts.map((part, index) =>
      index === usePartToEdit.index ? newPart : part
    );
    setPartToEdit(null);
    setParts(partsOk);
    handleNext();
  };

  const editPart = (n) => {
    setPartToEdit({ part: useParts[n], index: n });
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

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
    const Job = useJob;
    Job.Partes = useParts;
    Job.Tipo = useJobType;
    try {
      const res = await addPrivateElement("Jobs", Job);
      handleNext();
    } catch (e) {
      setError(e);
    }
  };

  const handleUpdate = async () => {
    const Job = useJob;
    Job.Partes = useParts;
    try {
      const res = await putPrivateElement(
        `${databaseURL}jobs/${props.job._id}`,
        Job
      );
      handleNext();
    } catch (e) {
      setError(e);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setParts(props.job?.Partes || []);
    setJobType(props.job?.Tipo[0] || {});
    setJob(props.job || null);
  };

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
        <Typography variant="subtitle1">Partes del trabajo</Typography>
        <List sx={{ listStyleType: "bullet" }}>
          {useParts.map((part, index) => (
            <ListItem divider key={`${index}-Parte_${part.Finishing.length}`}>
              <ListItemText
                sx={{ display: "list-item" }}
                primary={part.Name}
                secondary={`${part.partStock.Tipo} ${part.partStock.Gramaje} ${part.partStock.Marca}`}
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
    <Box
      sx={{
        width: "100%",
        padding: "2%",
      }}
    >
      <Card raised sx={{ gap: "20px" }} color="info">
        <CardHeader
          title={useJob?.Nombre || "Nuevo Pedido"}
          subheader={useJob?.Cantidad || "Solicita tu presupuesto!"}
          action={
            <Button
              onClick={() => {
                navigate(-1);
              }}
            >
              Volver
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid
            container
            columns={12}
            sx={{ width: "100%", display: "flex", flexDirection: "row" }}
          >
            <Grid item>
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
                    Todos los pasos completados,
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
                    Step {activeStep + 1}
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

                  <Divider></Divider>
                </React.Fragment>
              )}
            </Grid>
            <Grid item xs>
              <Container>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  spacing={1}
                  overflow={"false"}
                  sx={{ height: "98%" }}
                >
                  {useParts?.map((part, index) => (
                    <Grid item xs={4} sm={4} md={6} key={"Parte-" + index}>
                      <PartCard
                        part={part}
                        index={index}
                        editPart={editPart}
                        addPart={addParts}
                        setActiveStep={setActiveStep}
                        removePart={removePart}
                      />
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
          message={useError.response.data.message || useError.message}
          color="success"
          action={resetError}
        />
      )}
    </>
  );

  return useError !== null ? statusError : statusOk;
};

export default JobStepper;
