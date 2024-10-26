import { useState, useEffect, useContext, Fragment } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import Input from "@mui/material/Input";
import Container from "@mui/material/Container";
import { Autocomplete, FormGroup, FormControlLabel } from "@mui/material";
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
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import MenuItem from "@mui/material/MenuItem";
import { Checkbox } from "@mui/material";
import { Grid } from "@mui/material";
import JobTypes from "./JobTypes";
import { fechtData, getPrivateElementByID } from "../customHooks/FetchDataHook";

const JobsForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const [useUsersList, setUsersList] = useState([]);
  const [useCompaniesList, setCompaniesList] = useState([]);
  const [useCompany, setCompany] = useState(props.data?.Company);
  const [useFinishingList, setFinishingList] = useState([]);
  const [selectedFinishings, setSelectedFinishings] = useState(
    props.data?.Finishing || []
  );
  // This state intializes chebox value
  // const [useValue, setMyValue] = useState({ value: "" });
  const [useJobType, setJobType] = useState(props.jobType.name || null);
  const context = useContext(AuthContext);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(false);
  const handleChange = (e) => {
    e.preventDefault();
    props.setJob(e);
  };

  const getUsers = async () => await fechtData("Users", setUsersList);
  const getCompanies = async () =>
    await fechtData("Empresas", setCompaniesList);
  const getCompany = async (id) => await getPrivateElementByID("empresas", id);
  const getFinishers = async () =>
    await fechtData("Finishers", setFinishingList);

  const changeHandler = (e, useFinishingList, Finisher) => {
    if (e.target.checked) {
      // Agregar el objeto seleccionado al array
      setSelectedFinishings((prevSelected) => [...prevSelected, Finisher]);
    } else {
      // Remover el objeto si se deselecciona
      setSelectedFinishings((prevSelected) =>
        prevSelected.filter((item) => item._id !== Finisher._id)
      );
    }
  };

  useEffect(() => {
    try {
      getUsers();
      getCompanies();
      getFinishers();
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }, [setUsersList, setCompaniesList, setFinishingList]);

  const onSubmit = (values) => {
    try {
      setLoading(true);
      const jt = JobTypes.find((item) => {
        if (item.id === values.JobType) {
          return item;
        }
      });
      values.JobType = jt;
      if (useCompany) {
        values.Company = useCompany;
      }

      props.setJob(values);
      props.setJobType(jt);
      props.continue(props.data ? 2 : 1);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    setValue("Finishing", selectedFinishings); // Esto actualiza el campo Finishing con los objetos seleccionados
  }, [selectedFinishings, setValue]);

  const error = <ErrorMessage message={useError} />;

  const loading = <Spinner />;

  const success = (
    <Box
      sx={{
        width: "fit-content",
      }}
    >
      <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="main">
        <CardHeader title="+ Nuevo Trabajo" />
        <CardContent>
          <FormControl>
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
                        : props.jobType?.id || props.data?.Tipo[0]?.id
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
                    onBlur={(e) => {
                      e.preventDefault();
                      trigger("JobType");
                      JobTypes.map((jt) => {
                        if (jt.id === e.target.value) {
                          setJobType(jt.name);
                          return jt.name;
                        }
                      });
                    }}
                  >
                    {JobTypes.map((jt) => {
                      return (
                        <MenuItem value={jt.id} key={jt.id} nombre={jt.name}>
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
                    defaultValue={props.data?.Entrega.slice(0, 10) || ""}
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
                  {Array.isArray(useUsersList) && (
                    <TextField
                      select
                      defaultValue={() => {
                        if (!useLoading && useUsersList.length > 0) {
                          console.log(useUsersList);
                          return (
                            props.data?.Owner?._id ||
                            props.data?.Owner ||
                            context.userLogged?._id ||
                            ""
                          );
                        } else {
                          return "";
                        }
                      }}
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
                  )}
                  {errors.Owner?.type === "required" && (
                    <FormHelperText>Seleccione un usuario</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={1} sm={2} md={4}>
                  <Autocomplete
                    id="Company"
                    options={useCompaniesList}
                    defaultValue={props.data?.Company}
                    autoHighlight
                    autoComplete={true}
                    getOptionLabel={(option) => option.Nombre}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        // Actualiza el valor del campo Company con el _id seleccionado
                        setValue("Company", newValue);
                        setCompany(newValue);
                      } else {
                        // Si el valor es nulo, elimina el valor del campo Company
                        setValue("Company", "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Empresa"
                        variant="outlined"
                        fullWidth
                        error={!!errors.Company}
                        helperText={
                          errors.Company ? "Seleccione una empresa" : ""
                        }
                      />
                    )}
                  />
                  {/* <TextField
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
                  )} */}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  {
                    <FormGroup
                      id="Finishing"
                      sx={{ display: "flex", flexDirection: "row", ml: 1 }}
                    >
                      {useFinishingList.map((Finisher) => {
                        const isChecked = selectedFinishings.some(
                          (f) => f._id === Finisher._id
                        );
                        if (
                          Finisher.jobTypesAllowed &&
                          Finisher.jobTypesAllowed.includes(useJobType)
                        ) {
                          return (
                            <FormControlLabel
                              key={Finisher._id}
                              control={
                                <Checkbox
                                  color="secondary"
                                  value={Finisher._id}
                                  defaultChecked={isChecked}
                                  onChange={(e) =>
                                    changeHandler(e, useFinishingList, Finisher)
                                  }
                                />
                              }
                              label={`${Finisher.Proceso} ${Finisher.Modelo}`}
                            />
                          );
                        }
                      })}
                    </FormGroup>
                  }
                </Grid>
                <Grid item xs={1} sm={2} md={4} sx={{ alignSelf: "center" }}>
                  <Button type="submit" variant="contained" color="primary">
                    {props.data ? "Modificar Trabajo" : "Agregar Trabajo"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );

  return useLoading ? loading : useError ? error : success;
};

export default JobsForm;
