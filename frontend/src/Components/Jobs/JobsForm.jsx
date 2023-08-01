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
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <form name="form1" action="" onChange={onSubmit}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 1, sm: 4, md: 8 }}
              >
                <Grid item xs={1} sm={2} md={4}>
                  <Select
                    id="JobTypeSelector"
                    value={props.jobType || JobTypes[0]}
                    defaultValue={""}
                    inputProps={{
                      name: "JobTypeSelector",
                      id: "JobTypeSelector",
                    }}
                    controlled={"true"}
                    variant="outlined"
                    label="Elegi un tipo de trabajo"
                    name="JobType"
                    sx={{ width: "90%" }}
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
                  <FormHelperText color="warning">
                    Selecciona un tipo de trabajo!
                  </FormHelperText>
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
                    variant="standard"
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
                    placeholder=""
                  />
                  <FormHelperText color="secondary">
                    Fecha de entrega
                  </FormHelperText>
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
