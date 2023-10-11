import * as React from "react";
import { useEffect } from "react";
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
import { Divider, Chip, Stack, Container, ButtonGroup } from "@mui/material";
import { parts } from "./JobsParts";
import {
  getPrivateElementByID,
  addPrivateElement,
} from "../customHooks/FetchDataHook";

export default function MyStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [useParts, setParts] = React.useState([]);
  const [useJobType, setJobType] = React.useState({});
  const [useJob, setJob] = React.useState(null);

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
    console.table(e.value);
    console.table(useJobType);
  };

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
    }
    const part = parts.filter((part) => part.id.includes(newPart.jobParts));
    newPart.jobParts = part;

    let partes = useParts;
    partes.push(newPart);
    try {
      setParts(partes);
    } catch (e) {
      console.log(e);
    }

    console.log("____________________");
    console.log(useParts);
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
      console.log(`Trabajo ${Job.Orden} agregado`);
      handleNext();
    } catch (e) {
      console.log("No funciono" + e);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setParts([]);
    setJobType({});
    setJob({});
  };

  const steps = [
    [
      "Defina el tipo de producto",
      <JobsForm
        jobType={useJobType}
        data={useJob}
        setJob={setJob}
        continue={handleNext}
      />,
    ],
    [
      "Agregue las partes",
      <JobParts jobType={useJobType} job={useJob} addParts={addParts} />,
    ],
    [
      "Confirme el pedido",
      <Box>
        {useParts.map((part) => {
          return <div key={part.jobParts.id}>{part.jobParts.type}</div>;
        })}
      </Box>,
    ],
  ];

  return (
    <Box
      sx={{
        width: "fit-content",
      }}
    >
      <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="info">
        <CardHeader
          title={useJob?.jobName || "Nuevo Trabajo"}
          subheader={useJob?.quantity || "Solicita tu presupuesto!"}
        />
        <CardContent>
          <Container>
            <Stack direction={"row"}>
              {useParts.map((part) => {
                return (
                  <Container key={part.id}>
                    <Card>
                      <CardHeader title={part.jobParts[0].type}></CardHeader>
                      <Container>
                        Paginas: {part.pages}
                        <br />
                        Formato: {part.Ancho} x {part.Alto}
                        <br />
                        Impresion: {part.coloresFrente}/{part.coloresDorso}
                        <br />
                        Material: {part.partStock.Nombre_Material}
                      </Container>
                      <CardActions>
                        <ButtonGroup size="small">
                          <Button color="primary">Editar</Button>
                          <Button color="error">Eliminar</Button>
                        </ButtonGroup>
                      </CardActions>
                    </Card>
                  </Container>
                );
              })}
            </Stack>
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
                      Optional
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
                  All steps completed - you&apos;re finished
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
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Skip
                    </Button>
                  )}
                  <Button
                    onClick={
                      activeStep === steps.length - 1 ? handlePost : handleNext
                    }
                    variant="filled"
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
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
}
