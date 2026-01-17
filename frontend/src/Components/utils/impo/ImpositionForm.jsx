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
    try {
      setLoading(true);
      const filteredPrinters = printersList.filter(
        (impresora) =>
          impresora.Colores >=
          Math.max(
            props.part?.ColoresFrente || 0,
            props.part?.ColoresDorso || 0
          )
      );
      setLoading(false);
      return filteredPrinters;
    } catch (error) {
      setLoading(false);
      setErrorMessage(error);
    }
  };

  let useFormatsFiltered = useFormats.filter(
    (f) =>
      Math.max(f.Ancho, f.Alto) >=
        Math.max(props.part?.Ancho || 0, props.part?.Alto || 0) &&
      Math.min(f.Ancho, f.Alto) >=
        Math.min(props.part?.Ancho || 0, props.part?.Alto || 0) &&
      Math.max(f.Ancho, f.Alto) <=
        Math.max(
          useSelectedPrinter.X_Maximo || 0,
          useSelectedPrinter.Y_Maximo || 0
        ) &&
      Math.min(f.Ancho, f.Alto) <=
        Math.min(
          useSelectedPrinter.X_Maximo || 0,
          useSelectedPrinter.Y_Maximo || 0
        ) &&
      Math.min(f.Ancho, f.Alto) >=
        Math.min(
          useSelectedPrinter.X_Minimo || 0,
          useSelectedPrinter.Y_Minimo || 0
        )
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
      const getPrinters = await getPrivateElements("impresoras/simple");

      const filteredPrinters = filterPrinters(await getPrinters);

      //console.table(filteredPrinters);

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
    values.printerSelector = useSelectedPrinter;
    values.formatSelector = customFormat ? "Personalizado" : selectedFormat;
    context.setImpoData(values);
    props.doImposition(values);
  };

  const AlertError = <ErrorMessage message={useErrorMessage?.message} />;

  useEffect(() => {
    fetchingData();
    if (props.impositionSettings?.printerSelector) {
      setSelectedPrinter(props.impositionSettings?.printerSelector);
    }
    // Inicializar formato y tamaño personalizado si corresponde
    if (props.impositionSettings?.formatSelector === "Personalizado") {
      setCustomFormat(true);
      setSelectedFormat("Personalizado");
    } else if (props.impositionSettings?.formatSelector) {
      setSelectedFormat(props.impositionSettings?.formatSelector);
      setCustomFormat(false);
    }
    if (props.impositionSettings) {
      setValue(
        "printerSelector",
        props.impositionSettings?.printerSelector?._id
      );
      setValue("widthPage", props.part?.Ancho || "");
      setValue("heightPage", props.part?.Alto || "");
      setValue(
        "formatSelector",
        props.impositionSettings?.formatSelector?._id || ""
      );
      // Si es personalizado, seteamos los valores originales
      if (props.impositionSettings?.formatSelector === "Personalizado") {
        setValue("formatSelector", "Personalizado");
      }
      setValue(
        "widthSheet",
        props.impositionSettings?.sheetOriginalSize?.width || ""
      );
      setValue(
        "heightSheet",
        props.impositionSettings?.sheetOriginalSize?.height || ""
      );
    }
  }, []);

  useEffect(() => {
    if (props.impositionSettings) {
      handleSubmit(onSubmit)();
    }
  }, [JSON.stringify(props.impositionSettings), props.canvasSize]);

  return (
    <FormControl sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columns={12} spacing={1}>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <TextField
                select
                name={"printerSelector"}
                variant="outlined"
                color="primary"
                value={useSelectedPrinter?._id ?? ""}
                SelectProps={{ displayEmpty: true }}
                label="Impresora"
                size="small"
                margin="dense"
                {...register("printerSelector", { required: false })}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedPrinter = usePrinters.find(
                    (p) => p._id === selectedId
                  );
                  setSelectedPrinter(selectedPrinter || {});
                  setValue("printerSelector", selectedId);
                }}
                onBlur={() => {
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
                      value={Printer._id}
                      id={usePrinters.indexOf(Printer) + Printer._id}
                      key={usePrinters.indexOf(Printer) + Printer._id}
                    >
                      {/* <Chip
                        variant="filled"
                        color="success"
                        size="large"
                        label={Printer.Nombre}
                      /> */}
                      <Typography variant="subtitle1">
                        {Printer.Fabricante} {Printer.Modelo}{" "}
                        <b>
                          {Printer.Colores > 4
                            ? "(cmyk + spot)"
                            : Printer.Colores === 4
                            ? "(cmyk)"
                            : Printer.Colores === 1
                            ? "(k)"
                            : "Error"}{" "}
                        </b>
                      </Typography>
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
                variant="outlined"
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
                variant="outlined"
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
                variant="outlined"
                name="Calle"
                defaultValue={props.impositionSettings?.Calle || 0}
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
                variant="outlined"
                name="margenes"
                defaultValue={props.impositionSettings?.margenes || 0}
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
                variant="outlined"
                color="primary"
                value={
                  customFormat ? "Personalizado" : selectedFormat?._id || ""
                }
                label="Formato"
                size="small"
                margin="dense"
                {...register("formatSelector", { required: false })}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "Personalizado") {
                    setCustomFormat(true);
                    setSelectedFormat("Personalizado");
                    setValue("formatSelector", "Personalizado");
                    // Si hay valores originales, los ponemos
                    setValue(
                      "widthSheet",
                      props.impositionSettings?.sheetOriginalSize?.width || ""
                    );
                    setValue(
                      "heightSheet",
                      props.impositionSettings?.sheetOriginalSize?.height || ""
                    );
                  } else {
                    setCustomFormat(false);
                    const formatObj = useFormatsFiltered.find(
                      (f) => f._id === value
                    );
                    setSelectedFormat(formatObj || "");
                    setValue("formatSelector", formatObj);
                    setValue("widthSheet", formatObj?.Ancho || "");
                    setValue("heightSheet", formatObj?.Alto || "");
                  }
                }}
                onBlur={() => {
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
                      value={Format._id}
                      id={useFormats.indexOf(Format) + Format._id}
                      key={useFormats.indexOf(Format) + Format._id}
                    >
                      <Typography variant="button">{Format.Nombre}</Typography>
                    </MenuItem>
                  ))
                )}
                <MenuItem
                  value={"Personalizado"}
                  id={"FormatoPersonalizado"}
                  key={"FormatoPersonalizado"}
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
                label={customFormat ? "Ancho Pliego" : ""}
                disabled={!customFormat}
                variant="outlined"
                name="widthSheet"
                defaultValue={
                  props.impositionSettings?.sheetOriginalSize?.width || ""
                }
                onChange={() => {
                  setCustomFormat(true);
                  setValue("formatSelector", "Personalizado");
                }}
                {...register("widthSheet", {
                  required: customFormat,
                })}
                onBlur={() => {
                  setCustomFormat(true);
                  setValue("formatSelector", "Personalizado");
                  trigger("widthSheet");
                }}
                size="small"
                margin="dense"
              />
            </FormControl>
            {errors.widthSheet?.type === "required" && customFormat && (
              <FormHelperText>Este campo es requerido</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                type="number"
                label={customFormat ? "Alto Pliego" : ""}
                disabled={!customFormat}
                variant="outlined"
                name="heightSheet"
                defaultValue={
                  props.impositionSettings?.sheetOriginalSize?.height || ""
                }
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
              {errors.heightSheet?.type === "required" && customFormat && (
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
