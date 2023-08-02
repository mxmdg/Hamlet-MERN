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
import JobTypes from "./JobTypes";

const JobsForm = (props) => {
  const handleChange = (e) => {
    e.preventDefault();
    props.setJob(e);
  };

  const onSubmit = (values) => console.log(values);

  return (
    <Box
      sx={{
        width: "fit-content",
      }}
    >
      <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="main">
        <CardHeader
          title="Completa el formulario"
          subheader="y solicita tu presupuesto!"
        />
        <CardContent>
          <FormControl sx={{ width: "90%" }}>
            <form name="form1" action="" onChange={onSubmit}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 1, sm: 4, md: 8 }}
              >
                <Grid item xs={1} sm={2} md={4}>
                  <InputLabel id="demo-simple-select-label">
                    Tipo de trabajo
                  </InputLabel>
                  <Select
                    id="JobTypeSelector"
                    {...(props.jobType
                      ? { value: props.jobType }
                      : { displayEmpty: true })}
                    inputProps={{
                      name: "JobTypeSelector",
                      id: "JobTypeSelector",
                    }}
                    controlled={"true"}
                    variant="outlined"
                    color="primary"
                    label="Tipo de trabajo"
                    name="JobType"
                    sx={{ width: "100%" }}
                    onChange={props.onChange}
                  >
                    {JobTypes.map((jt) => {
                      return (
                        <MenuItem value={jt} key={jt.id}>
                          {jt.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="jobName"
                    label="Nombre del Trabajo"
                    variant="outlined"
                    name="jobName"
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="quantity"
                    type="number"
                    label="Cantidad"
                    variant="outlined"
                    name="quantity"
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="endDate"
                    type="date"
                    label="Fecha de entrega"
                    variant="outlined"
                    name="endDate"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        placeholder: " ",
                      },
                    }}
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
