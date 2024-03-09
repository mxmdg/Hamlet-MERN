import * as React from "react";
import { useEffect } from "react";
import { useContext } from "react";
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
  Chip,
  Stack,
  Container,
  ButtonGroup,
  Grid,
} from "@mui/material";
//import { parts } from "./JobsParts";
import {
  getPrivateElementByID,
  addPrivateElement,
  fechtData,
} from "../customHooks/FetchDataHook";
import { calcularLomo } from "../jobViewer/JobDetail";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function MyStepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [allParts, setAllParts] = React.useState([]);
  const [useParts, setParts] = React.useState(props.job?.Partes || []);
  const [usePartToEdit, setPartToEdit] = React.useState(null);
  const [useJobType, setJobType] = React.useState(props.job?.Tipo[0] || {});
  const [useJob, setJob] = React.useState(props.job || null);
  const [useError, setError] = React.useState(null);
  const context = useContext(AuthContext);

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
    console.table(e.value);
    console.table(useJobType);
  };

  const parts = allParts;

  const addParts = (newPart) => {
    console.log("adding part...");
    console.log(newPart);
    try {
      const getStock = async (id) => {
        const stock = await getPrivateElementByID("materiales", id);
        newPart.partStock = stock.data;
      };
      getStock(newPart.partStock);
      /*  const part = parts.find((parte)=>{
        parte.id == newPart.jobParts ?
        parte :
        console.log("No encuentro " + parte.id)
      }) */
      //newPart.jobParts = part
    } catch (e) {
      console.log(e);
      setError(e);
    }
    const part = parts.filter((part) => part._id === newPart.jobParts);
    newPart.jobParts = part;

    let partes = useParts;
    partes.push(newPart);

    try {
      setParts(partes);
      handleNext();
    } catch (e) {
      console.log(e);
      setError(e);
    }

    console.log("____________________");
    console.log(useParts);
  };

  const removePart = (n) => {
    const partsOk = useParts.splice(n, 1);
    console.log(`Eliminar la parte ${n} de ${partsOk}`);
    console.log(partsOk);
  };

  const replacePart = (n, replace) => {
    console.table(useParts);
    const partsOk = [useParts.splice(n, 1, replace)];
    console.table(partsOk);
    console.log(`Reemplazar la parte ${n + 1} de ${partsOk.length}`);
    setParts(partsOk);
  };

  const editPart = (n) => {
    console.log(`Editar la parte ${n + 1} de ${useParts.length}`);
    const res = setPartToEdit({ part: useParts[n], index: n });
    return res;
  };

  // El siguiente array contiene los componentes
  // que se rendarizan en cada paso del stepper:

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
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
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
    console.log(Job);
    try {
      console.log("Guardando...");
      const res = await addPrivateElement("Jobs", Job);
      console.log(`Trabajo ${Job.Nombre} agregado`);
      handleNext();
    } catch (e) {
      console.log(e);
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
      />,
    ],
    [
      "Confirme el pedido",
      <Box >
        {useParts.map((part) => {
          return <div key={part._id}>{part.jobParts?.type}</div>;
        })}
      </Box>,
    ],
  ];

  useEffect(() => {
    try {
      fechtData("jobParts", setAllParts);
    } catch (error) {
      setError(error);
    }
  }, [useJob]);

  const statusOk = (
    <Box
      sx={{
        width: "fit-content",
      }}
    >
      <Card raised sx={{ gap: "20px" }} color="info">
        <CardHeader
          title={useJob?.Nombre || "Nuevo Pedido"}
          subheader={useJob?.Cantidad || "Solicita tu presupuesto!"}
        />
        <CardContent>
          <Container>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              spacing={1}
              overflow={"auto"}
            >
              {useParts?.map((part, index) => {
                return (
                  <Grid item xs={4} sm={4} md={6} key={part._id}>
                    <Card elevation={12} square={true}>
                      <CardHeader
                        title={part.Name}
                        subheader={part.jobParts[0].Type}
                      ></CardHeader>
                      <Container>
                        Paginas: {part.Pages}
                        <br />
                        Formato: {part.Ancho} x {part.Alto}
                        <br />
                        Impresion: {part.ColoresFrente}/{part.ColoresDorso}
                        <br />
                        Material: {part.partStock.Nombre_Material}
                        <br />
                        {part.jobParts[0].Type.includes(
                          "Interior" || "Insert"
                        ) ? (
                          <>
                            Lomo:{" "}
                            {calcularLomo(
                              part.Pages,
                              part.partStock.Espesor_Resma
                            )}{" "}
                            mm.
                          </>
                        ) : (
                          ""
                        )}
                      </Container>
                      <CardActions>
                        <ButtonGroup size="small">
                          <Button
                            color="primary"
                            onClick={(e) => {
                              e.preventDefault();
                              editPart(index);
                              setActiveStep(1);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            color="error"
                            onClick={() => {
                              removePart(index);
                            }}
                          >
                            Eliminar
                          </Button>
                        </ButtonGroup>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
          <Divider></Divider>
          <Box sx={{ width: "100%" }}>
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
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    variant="filled"
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    {activeStep < steps.length - 1
                      ? "Modificar Datos del Trabajo"
                      : "Agregar más partes"}
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Saltar
                    </Button>
                  )}
                  <Button
                    onClick={
                      activeStep === steps.length - 1 ? handlePost : handleNext
                    }
                    variant="filled"
                  >
                    {activeStep === steps.length - 1
                      ? "Enviar Pedido"
                      : "Siguiente"}
                  </Button>
                  {/* {useJob !== null && (
                    <Button onClick={handleNext} variant="filled">
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                )} */}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const statusError = (
    <ErrorMessage
      message={useError?.response.data.message}
      action={resetError}
    />
  );

  return useError !== null ? statusError : statusOk;
}
