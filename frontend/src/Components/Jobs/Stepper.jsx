import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Modal,
  Container,
  ButtonGroup,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
//import { parts } from "./JobsParts";
import { serverURL, databaseURL } from "../Config/config";
import {
  getPrivateElementByID,
  addPrivateElement,
  putPrivateElement,
  fechtData,
} from "../customHooks/FetchDataHook";
import { calcularLomo } from "../jobViewer/JobDetail";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import PartCard from "./PartCard";

import {
  addElementToArray,
  removeElementFromArray,
  replaceElementInArray,
} from "../utils/generalData/arrayNormalizer";
import { use } from "react";

export default function MyStepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [allParts, setAllParts] = React.useState([]);
  const [useParts, setParts] = React.useState(props.job?.Partes || []);
  const [usePartToEdit, setPartToEdit] = React.useState(null);
  const [useJobType, setJobType] = React.useState(props.job?.Tipo[0] || {});
  const [useJob, setJob] = React.useState(props.job || null);
  const [useError, setError] = React.useState(null);
  const [stocks, setStocks] = React.useState([]);
  const [newJobId, setNewJobId] = React.useState(null);
  const [useModal, setModal] = React.useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = React.useState(false);
  const [copyDraftName, setCopyDraftName] = React.useState("");
  const [copySourcePart, setCopySourcePart] = React.useState(null);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

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

    let partes = addElementToArray(newPart, useParts);

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
    const partsOk = removeElementFromArray(n, useParts);
    setParts(partsOk);
  };

  const replacePart = (newPart) => {
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

    const partsOk = replaceElementInArray(
      newPart,
      useParts[usePartToEdit.index],
      useParts
    );
    setParts(partsOk);
    //console.log(`Reemplazar la parte ${n + 1} de ${partsOk.length}`);
    //console.log(partsOk);
    setPartToEdit(null);
    handleNext();
  };

  const editPart = (n) => {
    console.log(`Editar la parte ${n + 1} de ${useParts.length}`);
    const res = setPartToEdit({ part: useParts[n], index: n });
    return res;
  };

  // Abre el diálogo con los datos de la parte a copiar
  const openCopyDialog = (part) => {
    setCopySourcePart(part);
    setCopyDraftName(
      part && part.Name ? `${part.Name} - copia` : "Nueva parte - copia"
    );
    setCopyDialogOpen(true);
  };

  const handleConfirmCopy = () => {
    if (!copySourcePart) {
      setCopyDialogOpen(false);
      return;
    }
    // Crear una copia shallow para evitar mutar el original
    const newPart = { ...copySourcePart, Name: copyDraftName };
    const partes = addElementToArray(newPart, useParts);
    setParts(partes);

    // Reset dialog state
    setCopyDialogOpen(false);
    setCopySourcePart(null);
    setCopyDraftName("");
  };

  const handleCancelCopy = () => {
    setCopyDialogOpen(false);
    setCopySourcePart(null);
    setCopyDraftName("");
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
    let stepForward = props.job !== undefined && activeStep === 0 ? 2 : 1;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + stepForward);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetError = () => {
    setError(null);
    setJob(props.job);
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
    console.log(Job);
    Job.Partes = useParts;
    // Este forEach me parece que no hace falta...
    /* Job.Partes.forEach((part) => {
      part.Finishing = part.Finishing.map((f) => f._id);
    }); */
    Job.JobType = props.job ? props.job.Tipo[0] : useJobType;
    console.log(Job);
    try {
      console.log("Guardando...");
      const res = await addPrivateElement("Jobs", Job);
      console.log(res);
      setNewJobId(res.data);
      console.log(`Trabajo ${Job.Nombre} agregado`);
      handleNext();
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const handleUpdate = async () => {
    const Job = useJob;
    Job.Partes = useParts;
    console.log(Job);
    try {
      console.log("Guardando...");
      const res = await putPrivateElement(
        `${databaseURL}jobs/${props.job._id}`,
        Job
      );
      console.log(`Trabajo ${Job.Nombre} actualizado, ${res}`);
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
        stocks={stocks}
      />,
    ],
    [
      "Confirme el pedido",
      <Box>
        <Typography variant="subtitle1">Partes del trabajo</Typography>
        <List sx={{ listStyleType: "bullet" }}>
          {useParts.map((part, index) => {
            return (
              <ListItem divider key={`${index}-Parte`}>
                <ListItemText
                  sx={{ display: "list-item" }}
                  primary={part.Name}
                  secondary={`${part.partStock.Tipo} ${part.partStock.Gramaje} ${part.partStock.Marca}`}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>,
    ],
  ];

  // Nueva linea

  useEffect(() => {
    try {
      fechtData("jobParts", setAllParts);
      fechtData("materiales", setStocks);
    } catch (error) {
      setError(error);
    }
  }, [useJob, useParts]);

  const statusError = (
    <>
      {useError !== null && (
        <ErrorMessage
          message={useError.response.data.message || useError.message}
          color="success"
          action={resetError}
          buttonTxt="Reintentar"
        />
      )}
    </>
  );

  const success = (
    <>
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
                    <Button
                      onClick={() => navigate(`/jobs/edit/${newJobId}`)}
                      disabled={newJobId === null}
                      color="success"
                    >
                      Continuar...
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
                    <ButtonGroup variant="contained">
                      <Button
                        color="info"
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
                        color="success"
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
                  columns={12}
                  spacing={2}
                  overflow={"false"}
                  sx={{ height: "98%" }}
                >
                  {useParts?.map((part, index) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={useParts.length < 3 ? 12/useParts.length : 6}
                        md={useParts.length < 3 ? 12/useParts.length : 6}
                        lg={useParts.length < 3 ? 12/useParts.length : 4}
                        key={"Parte-" + index}
                      >
                        <PartCard
                          part={part}
                          index={index}
                          editPart={editPart}
                          addPart={addParts}
                          copyPart={openCopyDialog} // <- USAR openCopyDialog
                          setActiveStep={setActiveStep}
                          removePart={removePart}
                          step={activeStep}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );

  return useError !== null ? (
    statusError
  ) : (
    <>
      {success}
      <Dialog
        open={copyDialogOpen}
        onClose={handleCancelCopy}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Copiar parte</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la nueva parte"
            type="text"
            fullWidth
            value={copyDraftName}
            onChange={(e) => setCopyDraftName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCopy}>Cancelar</Button>
          <Button
            onClick={handleConfirmCopy}
            variant="contained"
            color="primary"
          >
            Confirmar copia
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
