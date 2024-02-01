// React Imports
import React from "react";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";

import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

// Mui Material Imports
import {
  TextField,
  Chip,
  MenuItem,
  Stack,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

// Hamlet Components
import { getPrivateElements } from "../../customHooks/FetchDataHook";
import { ImpoContext } from "./ImpoContext";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

export const ImpositionForm = (props) => {
  const context = useContext(ImpoContext);
  const [useFormats, setFormats] = useState([]);
  const [usePrinters, setPrinters] = useState([]);
  const [useSelectedPrinter, setSelectedPrinter] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [customFormat, setCustomFormat] = useState(false);
  const [useErrorMessage, setErrorMessage] = useState(null);
  const [useLoading, setLoading] = useState(true);

  const filterPrinters = (printersList) => {
    const filteredPrinters = printersList.filter(
      (impresora) =>
        impresora.Colores >=
        Math.max(props.part?.ColoresFrente || 0, props.part?.ColoresDorso || 0)
    );
    return filteredPrinters;
  };

  let useFormatsFiltered = useFormats.filter(
    (f) =>
      Math.max(f.Ancho, f.Alto) >=
        Math.max(props.part?.Ancho || 0, props.part?.Alto || 0) &&
      Math.min(f.Ancho, f.Alto) >=
        Math.min(props.part?.Ancho || 0, props.part?.Alto || 0) &&
      Math.max(f.Ancho, f.Alto) <=
        Math.max(useSelectedPrinter.X_Maximo || 0, useSelectedPrinter.Y_Maximo ||0) &&
      Math.min(f.Ancho, f.Alto) <=
          Math.min(useSelectedPrinter.X_Maximo || 0, useSelectedPrinter.Y_Maximo ||0) &&
      Math.min(f.Ancho, f.Alto) >=
        Math.min(useSelectedPrinter.X_Minimo || 0, useSelectedPrinter.Y_Minimo ||0)  
  );

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
      const getPrinters = await getPrivateElements("impresoras");

      const filteredPrinters = filterPrinters(await getPrinters)

      console.table(filteredPrinters)

      setFormats(gettedFormats);
      setPrinters(filteredPrinters);
      setLoading(false);
    } catch (e) {
      setErrorMessage(e);
      setLoading(false);
      return e;
    }
  };

  const onSubmit = (values) => {
    context.setImpoData(values);
    props.doImposition(values);
  };

  const AlertError = <ErrorMessage message={useErrorMessage?.message} />;

  useEffect(() => {
    fetchingData();
  }, [setFormats, setCustomFormat]);

  return (
    <FormControl sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columns={12} spacing={1}>
        <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <TextField
                select
                name={"printerSelector"}
                variant="filled"
                color="primary"
                defaultValue={""}
                label="Impresora"
                size="small"
                margin="dense"
                {...register("printerSelector", { required: false })}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
                onBlur={(e) => {
                  setSelectedPrinter(e.target.value);
                  console.log(useSelectedPrinter);
                  trigger("printerSelector");
                }}
              >
                {useLoading ? (
                  <CircularProgress color="secondary" />
                ) : useErrorMessage !== null ? (
                  AlertError
                ) : (
                  usePrinters?.map((Printer) => (
                    <MenuItem
                      value={Printer}
                      id={usePrinters.indexOf(Printer) + Printer._id}
                      key={usePrinters.indexOf(Printer) + Printer._id}
                    >
                      {/* <Chip
                        variant="filled"
                        color="success"
                        size="large"
                        label={Printer.Nombre}
                      /> */}
                      <Typography variant="button">{Printer.Fabricante} {Printer.Modelo} <b>{Printer.Colores===4?"(cmyk)":Printer.Colores===1?"(k)":"Error"} </b></Typography>
                    </MenuItem>
                  ))
                )}
                
              </TextField>
            </FormControl>

            {errors.printerSelector?.type === "required" && (
              <FormHelperText>Seleccione una impresora</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                type="number"
                label="Ancho Pagina"
                variant="filled"
                name="widthPage"
                defaultValue={props.part?.Ancho || ""}
                {...register("widthPage", {
                  required: true,
                })}
                onBlur={() => {
                  trigger("widthPage");
                }}
                size="small"
                margin="dense"
              />
              {errors.widthPage?.type === "required" && (
                <FormHelperText>Este campo es requerido</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                type="number"
                label="Alto Pagina"
                variant="filled"
                name="heightPage"
                defaultValue={props.part?.Alto || ""}
                {...register("heightPage", {
                  required: true,
                })}
                onBlur={() => {
                  trigger("heightPage");
                }}
                size="small"
                margin="dense"
              />
            </FormControl>

            {errors.heightPage?.type === "required" && (
              <FormHelperText>Este campo es requerido</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                type="number"
                label="Calle"
                variant="filled"
                name="Calle"
                defaultValue={0}
                {...register("Calle", {
                  required: false,
                })}
                onBlur={() => {
                  trigger("Calle");
                }}
                size="small"
                margin="dense"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                type="number"
                label="Margenes"
                variant="filled"
                name="margenes"
                defaultValue={0}
                {...register("margenes", {
                  required: false,
                })}
                onBlur={() => {
                  trigger("margenes");
                }}
                size="small"
                margin="dense"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                select
                name={"formatSelector"}
                variant="filled"
                color="primary"
                defaultValue={""}
                label="Formato"
                size="small"
                margin="dense"
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
                  setSelectedFormat(e.target.value);
                  console.log(selectedFormat);
                  trigger("formatSelector");
                }}
              >
                {useLoading ? (
                  <CircularProgress color="secondary" />
                ) : useErrorMessage !== null ? (
                  AlertError
                ) : (
                  useFormatsFiltered?.map((Format) => (
                    <MenuItem
                      value={Format}
                      id={useFormats.indexOf(Format) + Format._id}
                      key={useFormats.indexOf(Format) + Format._id}
                    >
                      {/* <Chip
                        variant="filled"
                        color="success"
                        size="large"
                        label={Format.Nombre}
                      /> */}
                      <Typography variant="button">{Format.Nombre}</Typography>
                    </MenuItem>
                  ))
                )}
                <MenuItem
                  value={"Personalizado"}
                  id={"FormatoPersonalizado"}
                  key={"FormatoPersonalizado"}
                  onBlur={() => setCustomFormat(true)}
                  dense={true}
                >
                  <Chip
                    variant="outlined"
                    size="small"
                    label="Personalizado"
                    color="secondary"
                  />
                </MenuItem>
              </TextField>
            </FormControl>

            {errors.formatSelector?.type === "required" && (
              <FormHelperText>Seleccione un formato</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                type="number"
                label={!customFormat ? "" : "Ancho Pliego"}
                disabled={customFormat ? false : true}
                variant="filled"
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
                size="small"
                margin="dense"
              />
            </FormControl>

            {errors.widthSheet?.type === "required" &&
              customFormat === true && (
                <FormHelperText>Este campo es requerido</FormHelperText>
              )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                type="number"
                label={!customFormat ? "" : "Alto Pliego"}
                disabled={customFormat ? false : true}
                variant="filled"
                name="heightSheet"
                onChange={() => setCustomFormat(true)}
                {...register("heightSheet", {
                  required: customFormat,
                })}
                onBlur={() => {
                  setCustomFormat(true);
                  trigger("heightSheet");
                }}
                size="small"
                margin="dense"
              />
              {errors.heightSheet?.type === "required" &&
                customFormat === true && (
                  <FormHelperText>Este campo es requerido</FormHelperText>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl>
              <Button variant="outlined" type="submit" color="primary">
                Imponer
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </FormControl>
  );
};
