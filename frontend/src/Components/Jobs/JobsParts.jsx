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

const JobParts = (props) => {
  const parts = [
    {
      type: "Tapa",
      pageRange: [1, 2],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [170, 350],
    },
    {
      type: "Contratapa",
      pageRange: [1, 2],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [170, 350],
    },
    {
      type: "Interior Binder",
      pageRange: [20, 1200],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [65, 170],
    },
    {
      type: "Interior Cosido",
      pageRange: [24, 1200],
      printModAllowed: ["duplex"],
      stockWeightRange: [65, 150],
    },
    {
      type: "Interior Anillado",
      pageRange: [8, 900],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Interior Revista",
      pageRange: [4, 72],
      printModAllowed: ["duplex"],
      stockWeightRange: [65, 300],
    },
    {
      type: "Hojas sueltas",
      pageRange: [1, 1000000],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Afiche",
      pageRange: [1, 1000],
      printModAllowed: ["simplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Señalador",
      pageRange: [1, 1000],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [150, 350],
    },
    {
      type: "Tarjeta",
      pageRange: [1, 1000],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [150, 350],
    },
    {
      type: "Etiqueta",
      pageRange: [1, 1000],
      printModAllowed: ["simplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Insert",
      pageRange: [1, 1000],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Diptico",
      pageRange: [1, 1000],
      printModAllowed: ["duplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Triptico",
      pageRange: [1, 1000],
      printModAllowed: ["duplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Folleto",
      pageRange: [1, 1000],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [65, 350],
    },
    {
      type: "Cubierta",
      pageRange: [1, 1000],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [150, 350],
    },
    {
      type: "Guardas",
      pageRange: [1, 1000],
      printModAllowed: ["simplex", "duplex"],
      stockWeightRange: [150, 350],
    },
  ];

  const onChangeHandler = (e) => {
    e.preventDefault();
    props.onChange(e.target.value);
  };

  return (
    <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="secondary">
      <CardContent>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 4, md: 8 }}
        >
          <Grid item xs={1} sm={2} md={4}>
            <InputLabel htmlFor="jobParts">Parte</InputLabel>
            <Select
              name="jobParts"
              label="Parte"
              onChange={props.onChange}
              variant="standard"
            >
              {parts.map((part) => (
                <MenuItem
                  value={[
                    part.type,
                    part.pageRange,
                    part.printModAllowed,
                    part.stockWeightRange,
                  ]}
                  id={`${parts.indexOf(part)}_jobPart`}
                  key={part.type}
                >
                  {part.type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

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
      </CardContent>
    </Card>
  );
};

export default JobParts;
