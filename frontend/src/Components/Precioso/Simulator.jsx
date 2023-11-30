import * as React from "react";
import { useForm } from "react-hook-form";
import {Encuadernacion, Laminado, Nuvera,iGenBN,iGenColor} from "./formSimulators";
import { fechtData } from "../customHooks/FetchDataHook";

import { Button, Container, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";



const Simulator = (props)=>{
  const [open, setOpen] = React.useState(true);
  const [useFormats, setFormats] = React.useState([{Nombre: 'A4', Ancho: '210', Alto: '297'}])
  const [useSimulation, setSimulation] = React.useState(null)
  const handleClose = () => {
    setOpen(false);
  };

  const simCLC = (item, quantity, format) => {
    let simulation;
    switch (item.Proceso) {
      case "nuvera":
        simulation = Nuvera(
          props.data.Valor, 
          props.data.Minimo, 
          quantity, 
          props.data.Entrada,
          Math.max(format.Alto, format.Ancho) 
        );
        break;
      case "igen color":
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
        props.data.Entrada,
        Math.max(format.Alto, format.Ancho) 
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
    console.log(simulation)
    setSimulation(simulation);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const onSubmit = (e)=>{
    e.preventDefault()
  }

  const getFormats = async ()=> {
    await fechtData('Formatos',setFormats)
  }

  React.useEffect(()=>{
    simCLC(props.data,50,{Ancho: 648, Alto: 315})
    getFormats()
  },[])

  const Form = () => {
    return (
      <Container >
      {/* <FormControl sx={{ width: "90%" }}>
        <form name="Simulador" onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="Cantidad"
                label="Cantidad"
                variant="outlined"
                defaultValue={1}
                name="Cantidad"
                {...register("Cantidad", {
                  required: true,
                  min: 0,
                  max: 10000000,
                })}
                onBlur={() => {
                  trigger("Cantidad");
                }}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
            <TextField
                      select
                      id="Pliego"
                      inputProps={{
                        name: "Pliego",
                        id: "Pliego",
                      }}
                      variant="outlined"
                      color="primary"
                      label="Formato del pliego"
                      name="Pliego"
                      defaultValue=""
                      fullWidth
                      {...register("Pliego", { required: true })}
                      onBlur={() => {
                        trigger("Pliego");
                      }}
                    >
                      {useFormats.map((jt) => {
                        return (
                          <MenuItem value={jt} key={jt.id}>
                            {jt.Nombre}
                          </MenuItem>
                        );
                      })}
                    </TextField>
            </Grid>
            <Grid item >
              <Typography>Unitario: {useSimulation?.Unitario}</Typography><br/>
              <Typography>Cantidad: {useSimulation?.Cantidad}</Typography><br/>
              <Typography>Total: {useSimulation?.Total}</Typography><br/>
            </Grid>
            <Grid item xs={1} sm={2} md={4} sx={{ alignSelf: "center" }}>
              <Button type="submit" variant="outlined" color="warning">
                Calcular
              </Button>
            </Grid>
            {useSimulation && (
              <Grid item >
              <Typography>Unitario: {useSimulation.Unitario}</Typography><br/>
              <Typography>Cantidad: {useSimulation.Cantidad}</Typography><br/>
              <Typography>Total: {useSimulation.Total}</Typography><br/>
            </Grid>
            )}
          </Grid>
        </form>
      </FormControl> */}
    </Container>
    )
  } 

  const output = (
    <Modal
        open={open}
        //onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container >
          <Paper sx={{padding: "50px"}}>
          <Form />
          <div>
            <Typography>Unitario: {useSimulation?.Unitario}</Typography><br/>
            <Typography>Cantidad: {useSimulation?.Cantidad}</Typography><br/>
            <Typography>Total: {useSimulation?.Total}</Typography><br/>
          </div>
            
          <h5>{props.process}</h5>
          <p>{props.data.Valor} - {props.data.Entrada} - {props.data.Minimo}</p>

        <Button onClick={()=>{props.stateSim(false)}}>Cerrar</Button>

      </Paper>
        </Container>
        
    </Modal>
  )

    return output
}

export default Simulator

