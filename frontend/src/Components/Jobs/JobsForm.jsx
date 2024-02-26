import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm, trigger } from "react-hook-form";
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
import { fechtData } from "../customHooks/FetchDataHook";

const JobsForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const [useUsersList, setUsersList] = useState([]);
  const [useCompaniesList, setCompaniesList] = useState([]);
  const context = useContext(AuthContext);

  const handleChange = (e) => {
    e.preventDefault();
    props.setJob(e);
  };

  const getUsers = async () => await fechtData("Users", setUsersList);
  const getCompanies = async () =>
    await fechtData("Empresas", setCompaniesList);

  useEffect(() => {
    getUsers();
    getCompanies();
  }, [setUsersList, setCompaniesList]);

  const onSubmit = (values) => {
    console.log(values);
    const jt = JobTypes.find((item) => {
      if (item.id === values.JobType) {
        return item;
      }
    });
    console.log(jt);
    values.JobType = jt;
    //console.log(context.userLogged?._id);
    //values.Owner = context.userLogged._id;
    props.setJob(values);
    props.continue();
    console.log(values);
  };

  return (
    <Box
      sx={{
        width: "fit-content",
      }}
    >
      <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="main">
        <CardHeader title="+ Nuevo Trabajo" />
        <CardContent>
          <FormControl sx={{ width: "90%" }}>
            <form name="form1" onSubmit={handleSubmit(onSubmit)}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 1, sm: 4, md: 8 }}
              >
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="Nombre"
                    label="Nombre del Trabajo"
                    variant="outlined"
                    defaultValue={props.data?.Nombre || ""}
                    name="Nombre"
                    {...register("Nombre", {
                      required: true,
                      minLength: 3,
                      maxLength: 50,
                    })}
                    onBlur={() => {
                      trigger("Nombre");
                    }}
                    fullWidth
                  />
                  {errors.Nombre?.type === "minLength" && (
                    <FormHelperText>
                      Este campo debe tener al menos de 3 caracteres.
                    </FormHelperText>
                  )}
                  {errors.Nombre?.type === "maxLength" && (
                    <FormHelperText>
                      Este campo debe tener menos de 50 caracteres.
                    </FormHelperText>
                  )}
                  {errors.Nombre?.type === "required" && (
                    <FormHelperText>Este campo es requerido</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    select
                    defaultValue={
                      props.data === null
                        ? ""
                        : props.data.jobType?.id || props.data?.Tipo[0]?.id
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
                    fullWidth
                    {...register("JobType", { required: true })}
                    onBlur={() => {
                      trigger("JobType");
                    }}
                  >
                    {JobTypes.map((jt) => {
                      return (
                        <MenuItem value={jt.id} key={jt.id}>
                          {jt.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  {errors.JobType?.type === "required" && (
                    <FormHelperText>
                      Seleccione un tipo de trabajo
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="Cantidad"
                    type="number"
                    label="Cantidad"
                    variant="outlined"
                    defaultValue={props.data?.Cantidad || ""}
                    name="Cantidad"
                    {...register("Cantidad", {
                      required: true,
                      min: 1,
                      max: 50000,
                    })}
                    onBlur={() => {
                      trigger("Cantidad");
                    }}
                    fullWidth
                  />
                  {errors.Cantidad?.type === "required" && (
                    <FormHelperText>Este campo es requerido</FormHelperText>
                  )}
                  {errors.Cantidad?.type === "min" && (
                    <FormHelperText>La cantidad minima es 1</FormHelperText>
                  )}
                  {errors.Cantidad?.type === "max" && (
                    <FormHelperText>La cantidad máxima es 50000</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    id="Entrega"
                    type="date"
                    label="Fecha de entrega"
                    variant="outlined"
                    defaultValue={props.data?.Entrega || ""}
                    name="Entrega"
                    {...register("Entrega", { required: true })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        placeholder: " ",
                      },
                    }}
                    onBlur={() => {
                      trigger("Entrega");
                    }}
                    fullWidth
                  />
                  {errors.Entrega?.type === "required" && (
                    <FormHelperText>
                      Establezca la fecha de entrega
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    select
                    defaultValue={
                      !context.useLogin
                        ? props.data?.Owner?._id || ""
                        : context.userLogged._id
                    }
                    id="Owner"
                    inputProps={{
                      name: "Owner",
                      id: "Owner",
                    }}
                    variant="outlined"
                    color="primary"
                    label="Usuario"
                    name="Owner"
                    fullWidth
                    {...register("Owner", { required: true })}
                    onBlur={() => {
                      trigger("Owner");
                    }}
                  >
                    {useUsersList.map((u) => {
                      return (
                        <MenuItem value={u._id} key={u._id}>
                          {u.Name} {u.LastName}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  {errors.Owner?.type === "required" && (
                    <FormHelperText>Seleccione un usuario</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <TextField
                    select
                    id="Company"
                    defaultValue={props.data?.Company?._id || ""}
                    inputProps={{
                      name: "Company",
                      id: "Company",
                    }}
                    variant="outlined"
                    color="primary"
                    label="Empresa"
                    name="Company"
                    fullWidth
                    {...register("Company", { required: true })}
                    onBlur={() => {
                      trigger("Company");
                    }}
                  >
                    {useCompaniesList.map((u) => {
                      return (
                        <MenuItem value={u._id} key={u._id}>
                          {u.Nombre}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  {errors.Company?.type === "required" && (
                    <FormHelperText>Seleccione una empresa</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={1} sm={2} md={4} sx={{ alignSelf: "center" }}>
                  <Button type="submit" variant="contained" color="primary">
                    Agregar Trabajo
                  </Button>
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
