import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "@mui/material/Input";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import MyStepper from "./Stepper";

const JobsForm = () => {
  return (
    <Box
      sx={{
        width: "fit-content",
      }}
    >
      <Card
        raised
        sx={{ gap: "20px", background: "#056", maxWidth: "600px" }}
        color="info"
      >
        <CardHeader
          title="Que necesitas?"
          subheader="Solicita tu presupuesto!"
        />
        <CardContent>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <form action="">
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 1, sm: 4, md: 8 }}
              >
                <Grid item xs={1} sm={2} md={4}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Elegi un tipo de trabajo
                  </InputLabel>
                  <Select
                    id="JobType"
                    label="Tipo de Trabajo"
                    variant="standard"
                    name="JobType"
                    sx={{ width: "90%" }}
                  >
                    <MenuItem value={10}>Libro</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                  <FormHelperText color="secondary">
                    Selecciona un tipo de trabajo!
                  </FormHelperText>
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="jobName"
                    label="Nombre del Trabajo"
                    variant="filled"
                    name="jobName"
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="quantity"
                    type="number"
                    label="Cantidad"
                    variant="standard"
                    name="quantity"
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="quantity"
                    type="number"
                    label="Cantidad"
                    variant="standard"
                    name="quantity"
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="quantity"
                    type="number"
                    label="Cantidad"
                    variant="standard"
                    name="quantity"
                  />
                </Grid>
              </Grid>
            </form>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobsForm;
