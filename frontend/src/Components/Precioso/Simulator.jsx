import * as React from "react";
import { useForm } from "react-hook-form";
import formSim from "./formSimulators";
import { fechtData } from "../customHooks/FetchDataHook";

import { Button } from "@mui/material";
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
  const handleClose = () => {
    setOpen(false);
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
    formSim.Nuvera(props.data.Valor, props.data.Minimo, e.data.Cantidad, props.data.Entrada,Math.max(e.data.Alto, e.data.Ancho) )
  }

  const getFormats = async ()=> {
    await fechtData('Formatos',setFormats)
  }

  React.useEffect(()=>{
    getFormats()
  },[])

  const form = (
    <Box>
    <FormControl sx={{ width: "90%" }}>
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
          <Grid item xs={1} sm={2} md={4} sx={{ alignSelf: "center" }}>
            <Button type="submit" variant="outlined" color="warning">
              Calcular
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormControl>
  </Box>
  )

  const output = (
    <Modal
        open={open}
        //onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper>
          <h5>{props.process}</h5>
          <p>{props.data.Valor} - {props.data.Entrada} - {props.data.Minimo}</p>
        <Button onClick={()=>{props.stateSim(false)}}>Cerrar</Button>

      </Paper>
    </Modal>
  )

    return output
}

export default Simulator

