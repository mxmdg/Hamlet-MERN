import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Encuadernacion,
  Laminado,
  Nuvera,
  iGenBN,
  iGenColor,
} from "./formSimulators";
import { fechtData } from "../customHooks/FetchDataHook";
import SimulationTable from "./SimulationTable";

import {
  Button,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import SendIcon from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

const Simulator = (props) => {
  const [open, setOpen] = React.useState(true);
  const [useFormats, setFormats] = React.useState([
    { Nombre: "A4", Ancho: "210", Alto: "297" },
  ]);
  const [useQuantity, setQuantity] = React.useState(100);
  const [useSheet, setSheet] = React.useState({
    Nombre: "A4",
    Ancho: "210",
    Alto: "297",
  });
  const [useSimulation, setSimulation] = React.useState(null);
  const handleClose = () => {
    setOpen(false);
  };

  const simCLC = (item, quantity, format) => {
    let simulation;
    console.log(item);
    switch (item) {
      case "nuvera":
      case "nuvera (LP)":
        simulation = Nuvera(
          props.data.Valor,
          props.data.Minimo,
          quantity,
          props.data.Entrada,
          Math.max(format.Alto, format.Ancho)
        );
        break;
      case "igen color":
      case "igen color (LP)":
        simulation = iGenColor(
          props.data.Valor,
          props.data.Minimo,
          quantity,
          props.data.Entrada,
          Math.max(format.Alto, format.Ancho)
        );
        break;
      case "laminado":
        simulation = Laminado(
          props.data.Valor,
          props.data.Minimo,
          quantity,
          Math.max(format.Alto, format.Ancho)
        );
        break;
      case "acaballado":
      case "pur":
      case "eva":
      case "anillado":
        simulation = Encuadernacion(
          props.data.Valor,
          props.data.Minimo,
          quantity,
          props.data.Entrada
        );
        break;
      case "igen b&n":
        simulation = iGenBN(
          props.data.Valor,
          props.data.Minimo,
          quantity,
          props.data.Entrada,
          Math.max(format.Alto, format.Ancho)
        );
        break;
      default:
        simulation = Encuadernacion(
          props.data.Valor,
          props.data.Minimo,
          quantity,
          props.data.Entrada,
          Math.max(format.Alto, format.Ancho)
        );
        break;
    }
    return simulation;
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const getFormats = async () => {
    await fechtData("Formatos", setFormats);
  };

  const cantidades = [100, 500, 1000];
  const pliegos = [
    { Ancho: 215, Alto: 315 },
    { Ancho: 470, Alto: 320 },
    { Ancho: 648, Alto: 315 },
  ];

  React.useEffect(() => {
    getFormats();
  }, []);

  const Form = () => {
    return (
      <Container>
        <Card elevation={10}>
          <CardContent>
            <form name="Simulador">
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 12, sm: 12, md: 12 }}
              >
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    type="number"
                    id="Cantidad"
                    label="Cantidad"
                    variant="outlined"
                    defaultValue={useQuantity}
                    onBlur={(e) => {
                      e.preventDefault();
                      setQuantity(e.target.value);
                      setSimulation(null);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    select
                    id="Pliego"
                    variant="outlined"
                    color="primary"
                    label="Formato del pliego"
                    name="Pliego"
                    fullWidth
                    defaultValue={useSheet}
                    onChange={(e) => {
                      e.preventDefault();
                      setSheet(e.target.value);
                      setSimulation(null);
                    }}
                  >
                    {useFormats.map((jt) => {
                      return (
                        <MenuItem key={jt._id} value={jt}>
                          {jt.Nombre}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3} sx={{ alignSelf: "center" }}>
                  <Button
                    variant="contained"
                    color="warning"
                    endIcon={<SendIcon />}
                    size="large"
                    onClick={() => {
                      console.log(props.data.Proceso, useQuantity, useSheet);
                      setSimulation(
                        simCLC(props.data.Proceso, useQuantity, useSheet)
                      );
                    }}
                  >
                    Calcular
                  </Button>
                </Grid>
                {useSimulation && (
                  <Grid item xs={12} sm={8} md={12}>
                    <Typography>Unitario: {useSimulation.Unitario}</Typography>
                    <br />
                    <Typography>Cantidad: {useSimulation.Cantidad}</Typography>
                    <br />
                    <Typography>Total: {useSimulation.Total}</Typography>
                    <br />
                  </Grid>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    );
  };

  const output = (
    <Modal
      open={open}
      //onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container>
        <Card sx={{ padding: "20px" }} elevation={4}>
          <CardHeader
            title={props.data.Proceso}
            action={
              <Button
                onClick={() => {
                  props.stateSim(false);
                }}
              >
                Cerrar
              </Button>
            }
          ></CardHeader>
          <CardContent>
            <Form />

            <SimulationTable
              data={props.data}
              pliegos={pliegos}
              cantidades={cantidades}
              simCLC={simCLC}
            />
          </CardContent>

          <CardActions></CardActions>
        </Card>
      </Container>
    </Modal>
  );

  return output;
};

export default Simulator;
