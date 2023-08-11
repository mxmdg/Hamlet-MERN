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
  console.log(props);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChange = (e) => {
    e.preventDefault();
    props.setJob(e);
  };

  const onSubmit = (values) => {
    console.log(values);
    const jt = JobTypes.find((item) => {
      if (item.id === values.JobType) {
        return item;
      }
    });
    console.log(jt);
    values.JobType = jt;
    props.setJob(values);
    console.log(values);
  };

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
            <form name="form1" onBlur={handleSubmit(onSubmit)}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 1, sm: 4, md: 8 }}
              >
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    select
                    defaultValue={
                      props.data.JobType == undefined
                        ? ""
                        : props.data.JobType.id
                    }
                    id="JobType"
                    inputProps={{
                      name: "JobType",
                      id: "JobType",
                    }}
                    variant="outlined"
                    color="primary"
                    label="Tipo de trabajo"
                    name="JobType"
                    onChange={(e) => console.log(e.target.value)}
                    fullWidth
                    {...register("JobType")}
                  >
                    {JobTypes.map((jt) => {
                      return (
                        <MenuItem value={jt.id} key={jt.id}>
                          {jt.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="jobName"
                    label="Nombre del Trabajo"
                    variant="outlined"
                    defaultValue={props.data.jobName || ""}
                    name="jobName"
                    {...register("jobName")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="quantity"
                    type="number"
                    label="Cantidad"
                    variant="outlined"
                    defaultValue={props.data.quantity || ""}
                    name="quantity"
                    {...register("quantity")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="endDate"
                    type="date"
                    label="Fecha de entrega"
                    variant="outlined"
                    defaultValue={props.data.endDate || ""}
                    name="endDate"
                    {...register("endDate")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        placeholder: " ",
                      },
                    }}
                    fullWidth
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
