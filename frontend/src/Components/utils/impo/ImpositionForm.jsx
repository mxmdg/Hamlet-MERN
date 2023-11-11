// React Imports
import React from "react";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";

import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

// Mui Material Imports
import {
  TextField,
  InputLabel,
  Chip,
  Select,
  MenuItem,
  Stack,
  Grid,
  Button,
  Divider,
  Typography,
} from "@mui/material";

// Hamlet Components
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import { ImpoContext } from "./ImpoContext";

export const ImpositionForm = (props) => {
  const context = useContext(ImpoContext);
  const [useFormats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  let [customFormat, setCustomFormat] = useState(false);

  const {
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onBlur",
  });

  const fetchingData = async () => {
    try {
      const gettedFormats = await getPrivateElements("formatos");
      setFormats(gettedFormats);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = (values) => {
    context.setImpoData(values);
    props.doImposition(values);
  };

  useEffect(() => {
    fetchingData();
  }, [setFormats, setCustomFormat]);

  return (
    <FormControl sx={{ width: "90%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Stack spacing={2}>
            <TextField
              type="number"
              label="Ancho Pagina"
              variant="standard"
              name="widthPage"
              defaultValue={props.part?.Ancho || ""}
              {...register("widthPage", {
                required: true,
              })}
              onBlur={() => {
                trigger("widthPage");
              }}
              color="warning"
              size="small"
              margin="dense"
            />
            {errors.widthPage?.type === "required" && (
              <FormHelperText>Este campo es requerido</FormHelperText>
            )}
            <TextField
              type="number"
              label="Alto Pagina"
              variant="standard"
              name="heightPage"
              defaultValue={props.part?.Alto || ""}
              {...register("heightPage", {
                required: true,
              })}
              onBlur={() => {
                trigger("heightPage");
              }}
              color="warning"
              size="small"
              margin="dense"
            />
            {errors.heightPage?.type === "required" && (
              <FormHelperText>Este campo es requerido</FormHelperText>
            )}
            <TextField
              type="number"
              label="Calle"
              variant="standard"
              name="Calle"
              defaultValue={0}
              {...register("Calle", {
                required: false,
              })}
              onBlur={() => {
                trigger("Calle");
              }}
              color="warning"
              size="small"
              margin="dense"
            />
            <TextField
              type="number"
              label="Margenes"
              variant="standard"
              name="margenes"
              defaultValue={0}
              {...register("margenes", {
                required: false,
              })}
              onBlur={() => {
                trigger("margenes");
              }}
              color="warning"
              size="small"
              margin="dense"
            />
            <TextField
              select
              name={"formatSelector"}
              variant="standard"
              color="primary"
              defaultValue={""}
              label="Formato"
              size="small"
              {...register("formatSelector", { required: false })}
              onChange={(e) => {
                console.log(e.target.value);
                setCustomFormat(false);
                setValue("widthSheet", parseFloat(e.target.value.Ancho), {
                  shouldValidate: false,
                  shouldTouch: true,
                  shouldDirty: true,
                });
                setValue("heightSheet", parseFloat(e.target.value.Alto), {
                  shouldValidate: false,
                  shouldTouch: true,
                  shouldDirty: true,
                });
              }}
              onBlur={(e) => {
                customFormat = false;
                setSelectedFormat(e.target.value);
                console.log(selectedFormat);
                trigger("formatSelector");
              }}
            >
              {useFormats?.map((Format) => (
                <MenuItem
                  value={Format}
                  id={useFormats.indexOf(Format) + Format._id}
                  key={useFormats.indexOf(Format) + Format._id}
                >
                  <Chip
                    variant="outlined"
                    color="primary"
                    size="small"
                    label={Format.Nombre}
                  />
                </MenuItem>
              ))}
              <MenuItem
                value={"Personalizado"}
                id={"FormatoPersonalizado"}
                key={"FormatoPersonalizado"}
                onBlur={() => setCustomFormat(true)}
                dense={true}
              >
                <Chip
                  variant="filled"
                  color="warning"
                  size="small"
                  label="Personalizado"
                />
              </MenuItem>
            </TextField>
            {errors.formatSelector?.type === "required" && (
              <FormHelperText>Seleccione un formato</FormHelperText>
            )}
            <TextField
              type="number"
              label={!customFormat ? "" : "Ancho Pliego"}
              disabled={customFormat ? false : true}
              variant="standard"
              name="widthSheet"
              onChange={() => {
                setCustomFormat(true);
                setValue("formatSelector", { Nombre: "Personalizado" });
              }}
              {...register("widthSheet", {
                required: true,
              })}
              onBlur={() => {
                setCustomFormat(true);
                setValue("formatSelector", { Nombre: "Personalizado" });
                trigger("widthSheet", {
                  required: true,
                });
              }}
              color="warning"
              size="small"
              margin="dense"
            />
            {errors.widthSheet?.type === "required" &&
              customFormat === true && (
                <FormHelperText>Este campo es requerido</FormHelperText>
              )}
            <TextField
              type="number"
              label={!customFormat ? "" : "Alto Pliego"}
              disabled={customFormat ? false : true}
              variant="standard"
              name="heightSheet"
              onChange={() => setCustomFormat(true)}
              {...register("heightSheet", {
                required: customFormat,
              })}
              onBlur={() => {
                setCustomFormat(true);
                trigger("heightSheet");
              }}
              color="warning"
              size="small"
              margin="dense"
            />
            {errors.heightSheet?.type === "required" &&
              customFormat === true && (
                <FormHelperText>Este campo es requerido</FormHelperText>
              )}
            <Button variant="contained" type="submit">
              Imponer
            </Button>
          </Stack>
        </Grid>
      </form>
    </FormControl>
  );
};
