import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { serverURL, databaseURL } from "../Config/config";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const [useErrorMessage, setErrorMessage] = React.useState(null);
  const navigate = useNavigate();
  //const params = useParams();

  const onSubmit = async (data) => {
    try {
      await axios.post(databaseURL + "users/register", data);
      console.log(data);
      navigate(-1);
    } catch (e) {
      setErrorMessage(e.response.data);
    }
    console.log("JSON.stringify(data)", JSON.stringify(data));
  };

  const resetError = () => {
    console.log("resetError");
    setErrorMessage(null);
    navigate(-1);
  };

  //axios.post(url[, data[, config]])
  const alertError = (
    <ErrorMessage
      message={useErrorMessage}
      severity={"error"}
      action={resetError}
    />
  );

  const success = (
    <Box>
      <Card elevation={10}>
        <CardHeader title="Registrate!" titleTypographyProps={{color: "primary", fontWeight: "600"}}></CardHeader>
        <CardContent>
          <FormControl sx={{ width: "90%" }}>
            <form name="Register" onSubmit={handleSubmit(onSubmit)}>
              <Grid
                container
                spacing={{ xs: 2, md: 5 }}
                columns={{ xs: 1, sm: 4, md: 6 }}
              >
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    id="Name"
                    label="Nombre"
                    variant="filled"
                    defaultValue={""}
                    name="Name"
                    {...register("Name", {
                      required: true,
                      minLength: 3,
                      maxLength: 40,
                    })}
                    onBlur={() => {
                      trigger("Name");
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    id="LastName"
                    label="Apellido"
                    variant="filled"
                    defaultValue={""}
                    name="LastName"
                    {...register("LastName", {
                      required: true,
                      minLength: 3,
                      maxLength: 40,
                    })}
                    onBlur={() => {
                      trigger("LastName");
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    select
                    defaultValue="Customer"
                    id="Role"
                    inputProps={{
                      name: "Role",
                      id: "Role",
                    }}
                    variant="filled"
                    color="primary"
                    label="Rol"
                    name="Role"
                    onChange={(e) => console.log(e.target.value)}
                    fullWidth
                    {...register("Role", { required: true })}
                    onBlur={() => {
                      trigger("Role");
                    }}
                  >
                    {/* <MenuItem value="Admin" key="role01">
                      Administrado
                    </MenuItem> */}
                    <MenuItem value="Manager" key="role02">
                      Vendedor
                    </MenuItem>
                    <MenuItem value="Operator" key="role03">
                      Operador
                    </MenuItem>
                    <MenuItem value="Customer" key="role04">
                      Cliente
                    </MenuItem>
                  </TextField>
                  {errors.JobType?.type === "required" && (
                    <FormHelperText>
                      Seleccione un tipo de usuario
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    id="email"
                    label="email"
                    variant="filled"
                    defaultValue={""}
                    name="email"
                    {...register("email", {
                      required: true,
                      minLength: 3,
                      maxLength: 40,
                    })}
                    onBlur={() => {
                      trigger("email");
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    id="password"
                    label="password"
                    type="password"
                    variant="filled"
                    defaultValue={""}
                    name="password"
                    {...register("password", {
                      required: true,
                      minLength: 3,
                      maxLength: 40,
                    })}
                    onBlur={() => {
                      trigger("password");
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3} sx={{ alignSelf: "center" }}>
                  <Button type="submit" variant="contained" color="primary">
                    Registrarse
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );

  return useErrorMessage !== null ? alertError : success;
};
