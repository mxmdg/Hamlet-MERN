import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Grid, Autocomplete } from "@mui/material";
import { fechtData } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import arrayNormalizer from "../utils/generalData/arrayNormalizer";
import { orderArrayByKey } from "../utils/generalData/arrayNormalizer";

// ---------------------------------------------------------------------------
// CAMBIO PRINCIPAL en este archivo:
//
// Se agregó soporte para partes marcadas con `_needsMapping: true`, que son
// partes importadas desde Papyrus u otras fuentes externas que tienen datos
// de texto (Name, Ancho, Alto, etc.) pero NO tienen jobParts ni partStock
// vinculados a IDs válidos en MongoDB.
//
// Comportamiento nuevo:
//  - Si editPart.part._needsMapping === true, el formulario se monta en modo
//    "nueva parte con datos precargados": los campos de texto se rellenan con
//    setValue() en un useEffect dedicado, pero el selector de tipo de parte y
//    el Autocomplete de material arrancan vacíos (igual que una parte nueva).
//  - El usuario ve un Alert informativo explicando qué tiene que hacer.
//  - Una vez que el usuario selecciona el tipo de parte, handleChange() toma
//    el control normal: filtra stocks, carga finishers, etc. — igual que
//    para partes nuevas.
//
// Cambios menores:
//  - filterStocks() se mueve a useEffect reactivo sobre currentPart para
//    evitar el problema de llamarla antes de que currentPart se actualice
//    (era un bug de closure presente en el código original).
//  - Se simplificó la lógica del useEffect principal eliminando la rama
//    para props.editPart con _id, que ya no aplica a partes importadas.
// ---------------------------------------------------------------------------

const JobParts = (props) => {
  const [stocks, setStocks] = useState(props.stocks || []);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [useStock, setStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [partsList, setPartsList] = useState([]);
  const [currentPart, setCurrentPart] = useState(null);
  const [useFinishingList, setFinishingList] = useState([]);
  const [selectedFinishings, setSelectedFinishings] = useState([]);
  const [useSimplex, setSimplex] = useState(false);
  const [useError, setError] = useState(false);

  // ¿Es una parte importada que necesita mapeo manual?
  const isImportedPart = props.editPart?.part?._needsMapping === true;

  const getFinishers = async () =>
    await fechtData("Finishers", setFinishingList);

  const resetError = () => setError(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    control,
  } = useForm({ mode: "onBlur" });

  // ---------------------------------------------------------------------------
  // CAMBIO: filterStocks como función pura que recibe la parte como argumento.
  // Antes se llamaba con el estado currentPart que podría estar desactualizado
  // por el closure. Ahora recibe explícitamente la parte a usar como filtro.
  // ---------------------------------------------------------------------------
  const filterStocksByPart = (part) => {
    if (!part || !stocks.length) {
      setFilteredStocks([]);
      return;
    }
    const res = stocks.filter(
      (stock) =>
        stock.Gramaje >= part.minStockWeight &&
        stock.Gramaje <= part.maxStockWeight,
    );
    setFilteredStocks(res);
  };

  const isMultipleOfFour = (value) =>
    props.job?.JobType === "Revista" && value % 4 !== 0
      ? "El número de páginas debe ser un múltiplo de 4"
      : true;

  const handleChange = (selectedValue) => {
    const part = partsList.find((item) => item._id === selectedValue);
    setCurrentPart(part || null);
    setSimplex(part?.PrintModAllowed === "Simplex");
    // CAMBIO: pasamos la parte directamente para evitar closure stale
    filterStocksByPart(part);
    getFinishers();
    // Resetear el stock seleccionado cuando cambia el tipo de parte
    setStock(null);
    setValue("partStock", "");
  };

  const changeHandler = (e, Finisher) => {
    const finisherId = Finisher._id;
    if (e.target.checked) {
      setSelectedFinishings((prev) => [...prev, finisherId]);
    } else {
      setSelectedFinishings((prev) => prev.filter((id) => id !== finisherId));
    }
  };

  // ---------------------------------------------------------------------------
  // CAMBIO: useEffect dedicado para precargar datos de partes importadas.
  // Si la parte tiene _needsMapping, cargamos los campos de texto con setValue
  // pero dejamos jobParts y partStock vacíos para forzar selección manual.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isImportedPart) return;

    const part = props.editPart.part;
    // Precargamos todos los campos que tengan datos del import
    if (part.Name) setValue("Name", part.Name);
    if (part.Ancho) setValue("Ancho", part.Ancho);
    if (part.Alto) setValue("Alto", part.Alto);
    if (part.Pages) setValue("Pages", part.Pages);
    if (part.ColoresFrente) setValue("ColoresFrente", part.ColoresFrente);
    if (part.ColoresDorso) setValue("ColoresDorso", part.ColoresDorso);
    // jobParts y partStock intencionalmente NO se precargan → usuario debe elegir
    setSelectedFinishings([]);
    setCurrentPart(null);
    setStock(null);
  }, [isImportedPart, props.editPart]);

  // useEffect para partes normales (MongoDB) con jobParts poblado
  useEffect(() => {
    if (isImportedPart) return; // ya manejado arriba
    if (!props.editPart) return;

    const partId = props.editPart?.part?.jobParts?.[0]?._id;
    if (!partId || !props.parts?.length) return;

    const found = props.parts.find((item) => item._id === partId);
    if (found) {
      setCurrentPart(found);
      setSimplex(found.PrintModAllowed === "Simplex");
    }
  }, [props.editPart, props.parts, isImportedPart]);

  // useEffect para stock preseleccionado en partes de MongoDB
  useEffect(() => {
    if (isImportedPart) return;
    if (props.editPart?.part?.partStock?._id) {
      setValue("partStock", props.editPart.part.partStock._id);
      setStock(props.editPart.part.partStock);
    }
  }, [props.editPart, setValue, isImportedPart]);

  // useEffect para Finishing en partes de MongoDB
  useEffect(() => {
    if (isImportedPart) return;
    if (props.editPart?.part?.Finishing) {
      const finishingIds = props.editPart.part.Finishing.map((f) =>
        typeof f === "object" ? f._id : f,
      ).filter(Boolean);
      setSelectedFinishings(finishingIds);
    } else {
      setSelectedFinishings([]);
    }
  }, [props.editPart, isImportedPart]);

  // Sincronizar Finishing con react-hook-form
  useEffect(() => {
    setValue("Finishing", selectedFinishings);
  }, [selectedFinishings, setValue]);

  // CAMBIO: filtrar stocks reactivamente cuando cambia currentPart o stocks
  useEffect(() => {
    filterStocksByPart(currentPart);
  }, [currentPart, stocks]);

  // useEffect principal: cargar lista de partes filtradas por tipo de trabajo
  useEffect(() => {
    const updateStocks = async () => {
      await fechtData("materiales", setStocks);
    };

    const filteredParts = props.parts.filter((part) =>
      part.jobTypesAllowed?.includes(props.jobType?.name),
    );

    try {
      setPartsList(orderArrayByKey(filteredParts, "Type"));
      getFinishers();
      updateStocks();
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(e);
    }
  }, [props.parts, props.jobType]);

  // ------- RENDERS -------

  const failed = (
    <ErrorMessage
      title="Error de JobsParts"
      message={useError}
      action={resetError}
    />
  );

  const loading = <Spinner title="Buscando elementos" color="success" />;

  const success = (
    <Card
      elevation={10}
      sx={{ gap: "20px", maxWidth: "600px" }}
      color="secondary"
    >
      <CardHeader
        title={`${props.editPart === null ? "Agregar" : "Editar"} partes del trabajo`}
        subheader={
          isImportedPart
            ? `Revisando parte importada: ${
                props.editPart.part?.Name +
                  " en " +
                  props.editPart?.part?.partStock || ""
              }`
            : props.editPart?.part?.Name
              ? `${
                  props.editPart.part.Name +
                  " en " +
                  props.editPart?.part?.partStock
                } — editando`
              : "Completar las partes del trabajo"
        }
      />
      <CardContent>
        {/* CAMBIO: Alert informativo para partes importadas */}
        {isImportedPart && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta parte fue importada desde Papyrus. Los datos de texto están
            precargados.{" "}
            <strong>Seleccioná el tipo de parte y el material</strong> para que
            el sistema aplique los filtros correctos.
          </Alert>
        )}

        <form
          name="form2"
          onSubmit={handleSubmit(
            props.editPart === null ? props.addParts : props.replacePart,
          )}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            {/* Selector de tipo de parte */}
            {partsList !== null && (
              <Grid size={{ xs: 1, sm: 2, md: 4 }}>
                <Controller
                  name="jobParts"
                  control={control}
                  rules={{ required: "Seleccione el tipo de parte" }}
                  // CAMBIO: partes importadas arrancan sin selección (string vacío)
                  defaultValue={
                    isImportedPart
                      ? ""
                      : props.editPart?.part?.jobParts?.[0]?._id || ""
                  }
                  render={({ field }) => (
                    <TextField
                      select
                      {...field}
                      id="jobParts"
                      variant="outlined"
                      color="primary"
                      label="Tipo de parte"
                      fullWidth
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleChange(e.target.value);
                      }}
                    >
                      {partsList.map((part) => (
                        <MenuItem value={part._id} key={part._id}>
                          {part.Type}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                {errors.jobParts && (
                  <FormHelperText error>
                    {errors.jobParts.message}
                  </FormHelperText>
                )}
              </Grid>
            )}

            {/* Nombre de la parte */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <TextField
                variant="outlined"
                type="text"
                name="Name"
                id="Name"
                label="Nombre de la parte"
                color="info"
                required
                // CAMBIO: para importadas, defaultValue queda vacío pero
                // useEffect carga el valor con setValue
                defaultValue={
                  isImportedPart
                    ? ""
                    : props.editPart === null
                      ? ""
                      : props.editPart.part?.Name
                }
                {...register("Name", {
                  required: true,
                  maxLength: 140,
                  minLength: 3,
                })}
                onBlur={() => trigger("Name")}
              />
              {errors.Name?.type === "required" && (
                <FormHelperText>
                  Agregue una descripción a la parte
                </FormHelperText>
              )}
              {errors.Name?.type === "maxLength" && (
                <FormHelperText>Máximo 140 caracteres</FormHelperText>
              )}
              {errors.Name?.type === "minLength" && (
                <FormHelperText>Mínimo 3 caracteres</FormHelperText>
              )}
            </Grid>

            {/* Ancho */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <TextField
                variant="outlined"
                type="number"
                name="Ancho"
                id="Ancho"
                label="Ancho"
                color="secondary"
                defaultValue={
                  isImportedPart
                    ? ""
                    : props.editPart === null
                      ? props.useParts[0]?.Ancho
                      : props.editPart.part?.Ancho
                }
                {...register("Ancho", {
                  required: true,
                  min: currentPart?.minWidth,
                  max: currentPart?.maxWidth,
                })}
                onBlur={() => trigger("Ancho")}
              />
              {errors.Ancho?.type === "required" && (
                <FormHelperText>Ingrese el ancho del producto</FormHelperText>
              )}
              {errors.Ancho?.type === "min" && (
                <FormHelperText>
                  Ancho mínimo: {currentPart?.minWidth}mm
                </FormHelperText>
              )}
              {errors.Ancho?.type === "max" && (
                <FormHelperText>
                  Ancho máximo: {currentPart?.maxWidth}mm
                </FormHelperText>
              )}
            </Grid>

            {/* Alto */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <TextField
                variant="outlined"
                type="number"
                name="Alto"
                id="Alto"
                label="Alto"
                color="secondary"
                defaultValue={
                  isImportedPart
                    ? ""
                    : props.editPart === null
                      ? props.useParts[0]?.Alto
                      : props.editPart.part?.Alto
                }
                {...register("Alto", {
                  required: true,
                  min: currentPart?.minHeight,
                  max: currentPart?.maxHeight,
                })}
              />
              {errors.Alto?.type === "required" && (
                <FormHelperText>Ingrese el alto del producto</FormHelperText>
              )}
              {errors.Alto?.type === "min" && (
                <FormHelperText>
                  Alto mínimo: {currentPart?.minHeight}mm
                </FormHelperText>
              )}
              {errors.Alto?.type === "max" && (
                <FormHelperText>
                  Alto máximo: {currentPart?.maxHeight}mm
                </FormHelperText>
              )}
            </Grid>

            {/* Páginas */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <TextField
                id="Pages"
                type="number"
                label="Páginas"
                variant="outlined"
                name="Pages"
                color="warning"
                defaultValue={
                  isImportedPart
                    ? ""
                    : props.editPart === null
                      ? ""
                      : props.editPart.part?.Pages
                }
                {...register("Pages", {
                  required: true,
                  validate: isMultipleOfFour,
                  min:
                    currentPart !== null
                      ? currentPart?.minPages
                      : props.job?.JobType?.pagMin,
                  max:
                    currentPart !== null
                      ? currentPart?.maxPages
                      : props.job?.JobType?.pagMax,
                })}
                onBlur={(e) => {
                  if (
                    e.target.value < 2 ||
                    currentPart?.PrintModAllowed === "Simplex"
                  ) {
                    setSimplex(true);
                  } else {
                    setSimplex(false);
                  }
                  trigger("Pages");
                }}
              />
              {errors.Pages?.type === "required" && (
                <FormHelperText>Ingrese la cantidad de páginas</FormHelperText>
              )}
              {errors.Pages?.type === "min" && (
                <FormHelperText>
                  Mínimo {currentPart?.minPages || props.job?.JobType?.pagMin}{" "}
                  páginas
                </FormHelperText>
              )}
              {errors.Pages?.type === "max" && (
                <FormHelperText>
                  Máximo {currentPart?.maxPages || props.job?.JobType?.pagMax}{" "}
                  páginas
                </FormHelperText>
              )}
            </Grid>

            {/* Material (Autocomplete) */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <Autocomplete
                id="partStock"
                options={filteredStocks}
                getOptionLabel={(option) =>
                  `${option.Nombre_Material} - ${option.Marca} (${option.Ancho_Resma}x${option.Alto_Resma})`
                }
                isOptionEqualToValue={(option, value) => {
                  if (value && typeof value === "object")
                    return option._id === value._id;
                  return option._id === value;
                }}
                value={useStock || null}
                noOptionsText={
                  currentPart
                    ? "Sin materiales para este gramaje"
                    : "Seleccioná primero el tipo de parte"
                }
                {...register("partStock", { required: true })}
                onBlur={() => trigger("partStock")}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setValue("partStock", newValue._id);
                    setStock(newValue);
                  } else {
                    setValue("partStock", "");
                    setStock(null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Material"
                    variant="outlined"
                    fullWidth
                    error={!!errors.partStock}
                    helperText={
                      errors.partStock
                        ? "Seleccione tipo y gramaje de papel"
                        : !currentPart
                          ? "Primero seleccioná el tipo de parte"
                          : ""
                    }
                  />
                )}
              />
            </Grid>

            {/* Colores Frente */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <TextField
                variant="outlined"
                type="number"
                name="ColoresFrente"
                id="ColoresFrente"
                label="Colores Frente"
                defaultValue={
                  isImportedPart
                    ? ""
                    : props.editPart === null
                      ? ""
                      : props.editPart.part?.ColoresFrente
                }
                color="secondary"
                {...register("ColoresFrente", {
                  required: true,
                  min: 1,
                  max: 6,
                })}
              />
              {errors.ColoresFrente?.type === "required" && (
                <FormHelperText>Ingrese el número de tintas</FormHelperText>
              )}
              {errors.ColoresFrente?.type === "min" && (
                <FormHelperText>Mínimo 1 tinta</FormHelperText>
              )}
              {errors.ColoresFrente?.type === "max" && (
                <FormHelperText>Máximo 6 tintas</FormHelperText>
              )}
            </Grid>

            {/* Colores Dorso */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <TextField
                variant="outlined"
                type="number"
                name="ColoresDorso"
                id="ColoresDorso"
                label="Colores Dorso"
                color="secondary"
                disabled={useSimplex}
                defaultValue={
                  isImportedPart
                    ? ""
                    : props.editPart === null
                      ? useSimplex
                        ? 0
                        : ""
                      : props.editPart.part?.ColoresDorso
                }
                {...register("ColoresDorso", {
                  required: false,
                  min: 0,
                  max: 6,
                })}
              />
              {errors.ColoresDorso?.type === "max" && (
                <FormHelperText>Máximo 6 tintas</FormHelperText>
              )}
            </Grid>

            {/* Terminaciones */}
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FormGroup
                id="Finishing"
                sx={{ display: "flex", flexDirection: "row", ml: 1 }}
              >
                {useFinishingList
                  .sort((a, b) =>
                    a.Proceso.toUpperCase() < b.Proceso.toUpperCase() ? -1 : 1,
                  )
                  .map((Finisher) => {
                    if (
                      Finisher.partTypesAllowed &&
                      Finisher.partTypesAllowed.includes(
                        currentPart?.Type || "",
                      )
                    ) {
                      return (
                        <FormControlLabel
                          key={Finisher._id}
                          control={
                            <Checkbox
                              color="secondary"
                              checked={selectedFinishings.includes(
                                Finisher._id,
                              )}
                              onChange={(e) => changeHandler(e, Finisher)}
                            />
                          }
                          label={`${Finisher.Proceso} ${Finisher.Modelo}`}
                        />
                      );
                    }
                    return null;
                  })}
              </FormGroup>
              <input
                type="hidden"
                {...register("Finishing", { required: true })}
              />
            </Grid>

            {/* Botón submit */}
            <Grid size={{ xs: 1, sm: 2, md: 4 }}>
              <FormControl sx={{ width: "85%" }}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color={isImportedPart ? "warning" : "primary"}
                >
                  {props.editPart === null
                    ? "Agregar Parte"
                    : isImportedPart
                      ? "Guardar parte importada"
                      : "Guardar cambios"}
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );

  return isLoading ? loading : !useError ? success : failed;
};

export default JobParts;
