import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Grid, Autocomplete } from "@mui/material";
import { fechtData, getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import arrayNormalizer from "../utils/generalData/arrayNormalizer";
import { orderArrayByKey } from "../utils/generalData/arrayNormalizer";

const JobParts = (props) => {
  /* Props que recibe este componente>
        jobType= El tipo de trabajo, determina los tipos de partes que se pueden utilizar en el mismo.
        job= El trabajo que estamos editando o copiando, si el trabajo es nuevo, es nulo.
        addParts= Funcion para agregar partes al trabajo nuevo o editado.
        replacePart= Funcion para reemplazar partes en el trabajo nuevo o editado.
        editPart= Parte seleccionada para edicion, debe pasar los valores al formulario.
        setEditPart= Esta funcion se utiliza en el componente padre para modificar props.editPart, pero no funciona. 
        useParts= Partes del tranajo nuevo o editando, se usa para pasar algunos parametros comunes a todas las partes, como el ancho y el alto.
        parts= Partes definidas en la base de datos con sus caracteristicas.
*/
  const [stocks, setStocks] = useState(props.stocks);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [useStock, setStock] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [partsList, setPartsList] = useState([]);
  const [currentPart, setCurrentPart] = useState(props.editPart || null);
  const [useFinishingList, setFinishingList] = useState([]);
  const [selectedFinishings, setSelectedFinishings] = useState(
    arrayNormalizer(props.editPart?.part.Finishing) || []
  );

  // Estado para inhabilitar ColoresDorso cuando el trabajo es una sola cara
  const [useSimplex, setSimplex] = useState(false);

  const getFinishers = async () =>
    await fechtData("Finishers", setFinishingList);

  const [useError, setError] = useState(false);

  const resetError = () => {
    console.log(useError);
    setError(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    control,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const filterStocks = () => {
    const res = stocks.filter((stock) => {
      try {
        if (
          props.editPart === null &&
          stock.Gramaje >= currentPart.minStockWeight &&
          stock.Gramaje <= currentPart.maxStockWeight
        ) {
          return stock;
        } else if (
          props.editPart !== null &&
          stock.Gramaje >= props.editPart.part.jobParts[0].minStockWeight &&
          stock.Gramaje <= props.editPart.part.jobParts[0].maxStockWeight
        ) {
          return stock;
        }
      } catch (error) {
        return error;
      }
    });
    setFilteredStocks(res);
  };

  const isMultipleOfFour = (value) => {
    return props.job?.JobType === "Revista" && value % 4 !== 0
      ? "El número de páginas debe ser un múltiplo de 4"
      : true;
  };

  const handleChange = (selectedValue) => {
    console.log(selectedValue);
    const part = partsList.find((item) => item._id === selectedValue);
    console.log(part);
    setCurrentPart(part);
    if (part?.PrintModAllowed === "Simplex") {
      setSimplex(true);
    } else {
      setSimplex(false);
    }
  };

  const changeHandler = (e, Finisher) => {
    const finisherId = Finisher._id;

    if (e.target.checked) {
      setSelectedFinishings((prev) => [...prev, finisherId]);
    } else {
      setSelectedFinishings((prev) => prev.filter((id) => id !== finisherId));
    }
  };

  useEffect(() => {
    //console.log(currentPart?._id);
  }, [currentPart]);

  useEffect(() => {
    const updateStocks = async () => {
      await fechtData("materiales", setStocks);
      filterStocks();
    };

    const filteredParts = props.parts.filter((part) =>
      part.jobTypesAllowed.includes(props.jobType.name)
    );

    if (props.editPart) {
      const partId = props.editPart?.part?.jobParts?.[0]?._id;

      if (!partId || !props.parts?.length) return;

      const found = props.parts.find((item) => item._id === partId);
      if (found) setCurrentPart(found);
    } /*else if (props.job?.Partes?.length) {
      const arr = [];

       props.job.Partes.forEach((p) => {
        if (Array.isArray(p.Finishing)) {
          arr.push(...p.Finishing);
        }
      });

      const Finishers = arrayNormalizer(arr);
      setSelectedFinishings(Finishers); 
    }*/

    try {
      //console.table(filteredParts);
      setPartsList(orderArrayByKey(filteredParts, "Type"));
      getFinishers();
      updateStocks();
      setIsLoading(false);
    } catch (e) {
      setError(e);
    }
  }, [
    setFilteredStocks,
    setPartsList,
    currentPart,
    setSimplex,
    setFinishingList,
  ]);

  useEffect(() => {
    if (props.editPart !== null && props.editPart.part?.partStock?._id) {
      setValue("partStock", props.editPart.part.partStock._id);
    }
  }, [props.editPart, setValue]);

  useEffect(() => {
    if (props.editPart?.part?.Finishing) {
      // Normalizar: si es objeto, extraer _id; si ya es string ID, dejarlo
      const finishingIds = props.editPart.part.Finishing.map((f) =>
        typeof f === "object" ? f._id : f
      ).filter((id) => id); // Filtrar valores nulos/undefined
      setSelectedFinishings(finishingIds);
    } else {
      setSelectedFinishings([]);
    }
  }, [props.editPart]);

  useEffect(() => {
    setValue("Finishing", selectedFinishings);
  }, [selectedFinishings, setValue]);

  //____________________________________RENDERS___________________________

  const failed = (
    <ErrorMessage
      title={"Error de JobsParts"}
      message={useError}
      action={resetError}
    />
  );

  const loading = <Spinner title="Buscando elementos" color="success" />;

  const success = (
    <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="secondary">
      <CardContent>
        <form
          name="form2"
          onSubmit={handleSubmit(
            //props.editPart === null ?
            props.editPart === null ? props.addParts : props.replacePart
          )}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            {partsList !== null && (
              <Grid item xs={1} sm={2} md={4}>
                {/* <TextField
                  select
                  value={
                    props.editPart !== null
                      ? props.editPart.part.jobParts[0]._id
                      : currentPart?._id || ""
                  }
                  id="jobParts"
                  inputProps={{
                    name: "jobParts",
                    id: "jobParts",
                  }}
                  variant="outlined"
                  color="primary"
                  label="Partes"
                  name="jobParts"
                  fullWidth
                  {...register("jobParts", { required: true })}
                  onChange={(e) => {
                    handleChange(e.target.value); // Llamamos a nuestra función handleChange
                    //field.onChange(e); // Importante llamar esto para que react-hook-form actualice los valores internamente
                  }}
                >
                  {partsList.map((part) => (
                    <MenuItem value={part._id} key={part._id}>
                      Parte: {part.Type}
                    </MenuItem>
                  ))}
                </TextField> */}
                <Controller
                  name="jobParts"
                  control={control}
                  rules={{ required: "Seleccione el tipo de parte" }}
                  defaultValue={props.editPart?.part?.jobParts?.[0]?._id || ""}
                  render={({ field }) => (
                    <TextField
                      select
                      {...field}
                      id="jobParts"
                      variant="outlined"
                      color="primary"
                      label="Partes"
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

                {errors.jobParts?.type === "required" && (
                  <FormHelperText>Seleccione el tipo de parte</FormHelperText>
                )}
              </Grid>
            )}
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="text"
                name="Name"
                id="Name"
                defaultValue={
                  props.editPart === null ? "" : props.editPart.part?.Name
                }
                label="Nombre de la parte"
                color="info"
                required
                {...register("Name", {
                  required: true,
                  maxLength: 140,
                  minLength: 3,
                })}
                onBlur={() => {
                  trigger("Name");
                }}
              />
              {errors.Name?.type === "required" && (
                <FormHelperText>
                  Agregue una descripcion o titulo a la parte
                </FormHelperText>
              )}
              {errors.Name?.type === "maxLength" && (
                <FormHelperText>Maximo 140 caracteres</FormHelperText>
              )}
              {errors.Name?.type === "minLength" && (
                <FormHelperText>Minimo 3 caracteres</FormHelperText>
              )}
            </Grid>

            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="Ancho"
                id="Ancho"
                label="Ancho"
                color="secondary"
                defaultValue={
                  props.editPart === null
                    ? props.useParts[0]?.Ancho
                    : props.editPart.part?.Ancho
                }
                {...register("Ancho", {
                  required: true,
                  min: currentPart?.minWidth,
                  max: currentPart?.maxWidth,
                })}
                onBlur={() => {
                  trigger("Ancho");
                }}
              />
              {errors.Ancho?.type === "required" && (
                <FormHelperText>
                  Ingrese la medida horizontal del producto
                </FormHelperText>
              )}
              {errors.Ancho?.type === "min" && (
                <FormHelperText>
                  El ancho minimo debe ser mayor a {currentPart?.minWidth}mm
                </FormHelperText>
              )}
              {errors.Ancho?.type === "max" && (
                <FormHelperText>
                  El ancho máximo debe ser menor a {currentPart?.maxWidth}mm
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="Alto"
                id="Alto"
                label="Alto"
                defaultValue={
                  props.editPart === null
                    ? props.useParts[0]?.Alto
                    : props.editPart.part?.Alto
                }
                color="secondary"
                {...register("Alto", {
                  required: true,
                  min: currentPart?.minHeight,
                  max: currentPart?.maxHeight,
                })}
              />
              {errors.Alto?.type === "required" && (
                <FormHelperText>
                  Ingrese la medida horizontal del producto
                </FormHelperText>
              )}
              {errors.Alto?.type === "min" && (
                <FormHelperText>
                  El ancho minimo debe ser mayor a {currentPart?.minHeight}mm
                </FormHelperText>
              )}
              {errors.Alto?.type === "max" && (
                <FormHelperText>
                  El ancho máximo debe ser menor a {currentPart?.maxHeight}mm
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                id="Pages"
                type="number"
                label="Paginas"
                variant="outlined"
                name="Pages"
                color="warning"
                defaultValue={
                  props.editPart === null ? "" : props.editPart.part?.Pages
                }
                {...register("Pages", {
                  required: true,
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
                  e.target.value < 2 ||
                  currentPart.PrintModAllowed === "Simplex"
                    ? setSimplex(true)
                    : setSimplex(false);
                  trigger("Pages");
                }}
              />
              {errors.Pages?.type === "required" && (
                <FormHelperText>Ingrese la cantidad de paginas</FormHelperText>
              )}
              {errors.Pages?.type === "min" && (
                <FormHelperText>
                  Cantidad minima de paginas{" "}
                  {currentPart?.minPages || props.job.JobType.pagMin}
                </FormHelperText>
              )}
              {errors.Pages?.type === "max" && (
                <FormHelperText>
                  Cantidad maxima de paginas{" "}
                  {currentPart?.maxPages || props.job.JobType.pagMax}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <Autocomplete
                id="partStock"
                options={filteredStocks}
                getOptionLabel={(option) =>
                  `${option.Nombre_Material} ${option.Gramaje}g - ${option.Marca} (${option.Ancho_Resma}x${option.Alto_Resma})`
                }
                isOptionEqualToValue={(option, value) => {
                  // Si value es un objeto, compara por _id
                  if (value && typeof value === "object") {
                    return option._id === value._id;
                  }
                  // Si value es un string (ID), compara con option._id
                  return option._id === value;
                }}
                value={
                  props.editPart !== null
                    ? filteredStocks.find(
                        (stock) =>
                          stock._id === props.editPart.part?.partStock?._id
                      ) || null
                    : useStock || null
                }
                {...register("partStock", { required: true })}
                onChange={(event, newValue) => {
                  const currenValue = event;
                  if (newValue) {
                    // Actualiza el valor del campo Company con el _id seleccionado
                    setValue("partStock", newValue._id);
                    setStock(newValue);
                  } else {
                    // Si el valor es nulo, elimina el valor del campo Company
                    setValue("partStock", "");
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
                        : ""
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="ColoresFrente"
                id="ColoresFrente"
                label="Colores Frente"
                defaultValue={
                  props.editPart === null
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
                <FormHelperText>
                  Ingrese el numero de tintas para la impresión
                </FormHelperText>
              )}
              {errors.ColoresFrente?.type === "min" && (
                <FormHelperText>
                  Como mínimo puede utilizarse 1 tinta
                </FormHelperText>
              )}
              {errors.ColoresFrente?.type === "max" && (
                <FormHelperText>
                  Como maximo podemos utilizar 6 tintas
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <TextField
                variant="outlined"
                type="number"
                name="ColoresDorso"
                id="ColoresDorso"
                label="Colores Dorso"
                color="secondary"
                disabled={useSimplex}
                defaultValue={
                  props.editPart === null
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
                <FormHelperText>
                  Como maximo podemos utilizar 6 tintas
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              {
                <FormGroup
                  id="Finishing"
                  sx={{ display: "flex", flexDirection: "row", ml: 1 }}
                >
                  {useFinishingList
                    .sort((a, b) => {
                      const nameA = a.Proceso.toUpperCase();
                      const nameB = b.Proceso.toUpperCase();
                      if (nameA < nameB) return -1;
                      if (nameA > nameB) return 1;
                      return 0;
                    })
                    .map((Finisher) => {
                      if (
                        Finisher.partTypesAllowed &&
                        Finisher.partTypesAllowed.includes(
                          currentPart?.Type || ""
                        )
                      ) {
                        return (
                          <FormControlLabel
                            key={Finisher._id}
                            control={
                              <Checkbox
                                color="secondary"
                                checked={
                                  selectedFinishings.includes(Finisher._id) ||
                                  false
                                }
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
              }
              <input
                type="hidden"
                {...register("Finishing", { required: true })}
              />
            </Grid>
            <Grid item xs={1} sm={2} md={4}>
              <FormControl sx={{ width: "85%" }}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                >
                  {props.editPart === null
                    ? "Agregar Parte"
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
