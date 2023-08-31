import React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { serverURL, databaseURL } from "../Config/config";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const navigate = useNavigate();
  const context = useContext(AuthContext);
  //const params = useParams();

  const onSubmit = async (data) => {
    try {
      const token = await axios.post(databaseURL + "users/login", data);
      console.log(token.data.token);
      context.handleLogin(token.data.token);
    } catch (e) {
      console.log("Fallo el login: " + e);
    }
    console.log("JSON.stringify(data)", JSON.stringify(data));
  };

  //axios.post(url[, data[, config]])

  return (
    <Box>
      <FormControl sx={{ width: "90%" }}>
        <form name="Register" onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="email"
                label="email"
                variant="outlined"
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
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="password"
                label="password"
                variant="outlined"
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
            <Grid item xs={1} sm={2} md={4} sx={{ alignSelf: "center" }}>
              <Button type="submit" variant="outlined" color="warning">
                Registrarse
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormControl>
    </Box>
  );
};
