// React Imports
import React from "react";
import { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";

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
import SmartMeasureInput from "../../Formulario/SmartMeasureInput";

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
            props.part?.ColoresDorso || 0,
          ),
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
          useSelectedPrinter.Y_Maximo || 0,
        ) &&
      Math.min(f.Ancho, f.Alto) <=
        Math.min(
          useSelectedPrinter.X_Maximo || 0,
          useSelectedPrinter.Y_Maximo || 0,
        ) &&
      Math.min(f.Ancho, f.Alto) >=
        Math.min(
          useSelectedPrinter.X_Minimo || 0,
          useSelectedPrinter.Y_Minimo || 0,
        ),
  );

  const {
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
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
        props.impositionSettings?.printerSelector?._id,
      );
      setValue("widthPage", props.part?.Ancho || "");
      setValue("heightPage", props.part?.Alto || "");
      setValue(
        "formatSelector",
        props.impositionSettings?.formatSelector?._id || "",
      );
      // Si es personalizado, seteamos los valores originales
      if (props.impositionSettings?.formatSelector === "Personalizado") {
        setValue("formatSelector", "Personalizado");
      }
      setValue(
        "widthSheet",
        props.impositionSettings?.sheetOriginalSize?.width || "",
      );
      setValue(
        "heightSheet",
        props.impositionSettings?.sheetOriginalSize?.height || "",
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
          <Grid size={{ xs: 12, md: 12 }}>
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
                    (p) => p._id === selectedId,
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
          {/* Ancho Pagina */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Controller
              name="widthPage"
              control={control}
              defaultValue={props.part?.Ancho || ""}
              rules={{ required: "Este campo es requerido" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <SmartMeasureInput
                  label="Ancho Pagina"
                  value={value}
                  subtype="length"
                  onChange={(val) => {
                    onChange(val);
                    trigger("widthPage");
                  }}
                  error={!!error}
                  helperText={error?.message}
                  size="small"
                  margin="dense"
                />
              )}
            />
          </Grid>

          {/* Alto Pagina */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Controller
              name="heightPage"
              control={control}
              defaultValue={props.part?.Alto || ""}
              rules={{ required: "Este campo es requerido" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <SmartMeasureInput
                  label="Alto Pagina"
                  value={value}
                  subtype="length"
                  onChange={(val) => {
                    onChange(val);
                    trigger("heightPage");
                  }}
                  error={!!error}
                  helperText={error?.message}
                  size="small"
                  margin="dense"
                />
              )}
            />
          </Grid>

          {/* Calle */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Controller
              name="Calle"
              control={control}
              defaultValue={props.impositionSettings?.Calle || 0}
              render={({ field: { onChange, value } }) => (
                <SmartMeasureInput
                  label="Calle"
                  value={value}
                  subtype="length"
                  onChange={(val) => {
                    onChange(val);
                    trigger("Calle");
                  }}
                  size="small"
                  margin="dense"
                />
              )}
            />
          </Grid>

          {/* Margenes */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Controller
              name="margenes"
              control={control}
              defaultValue={props.impositionSettings?.margenes || 0}
              render={({ field: { onChange, value } }) => (
                <SmartMeasureInput
                  label="Margenes"
                  value={value}
                  subtype="length"
                  onChange={(val) => {
                    onChange(val);
                    trigger("margenes");
                  }}
                  size="small"
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
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
                      props.impositionSettings?.sheetOriginalSize?.width || "",
                    );
                    setValue(
                      "heightSheet",
                      props.impositionSettings?.sheetOriginalSize?.height || "",
                    );
                  } else {
                    setCustomFormat(false);
                    const formatObj = useFormatsFiltered.find(
                      (f) => f._id === value,
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
          {/* Ancho Pliego */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Controller
              name="widthSheet"
              control={control}
              defaultValue={
                props.impositionSettings?.sheetOriginalSize?.width || ""
              }
              rules={{ required: customFormat }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <SmartMeasureInput
                  label={customFormat ? "Ancho Pliego" : "Ancho (Auto)"}
                  disabled={!customFormat}
                  value={value}
                  subtype="length"
                  onChange={(val) => {
                    onChange(val);
                    setCustomFormat(true);
                    setValue("formatSelector", "Personalizado");
                    trigger("widthSheet");
                  }}
                  error={!!error}
                  helperText={error?.message}
                  size="small"
                  margin="dense"
                />
              )}
            />
          </Grid>

          {/* Alto Pliego */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Controller
              name="heightSheet"
              control={control}
              defaultValue={
                props.impositionSettings?.sheetOriginalSize?.height || ""
              }
              rules={{ required: customFormat }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <SmartMeasureInput
                  label={customFormat ? "Alto Pliego" : "Alto (Auto)"}
                  disabled={!customFormat}
                  value={value}
                  subtype="length"
                  onChange={(val) => {
                    onChange(val);
                    setCustomFormat(true);
                    setValue("formatSelector", "Personalizado");
                    trigger("heightSheet");
                  }}
                  error={!!error}
                  helperText={error?.message}
                  size="small"
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
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
