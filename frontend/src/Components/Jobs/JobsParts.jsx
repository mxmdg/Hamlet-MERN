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
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import { fechtData, getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [partsList, setPartsList] = useState(null);
  const [currentPart, setCurrentPart] = useState(props.editPart || null);

  // Estado para inhabilitar ColoresDorso cuando el trabajo es una sola cara
  const [useSimplex, setSimplex] = useState(false);

  const [useError, setError] = useState(false);

  const resetError = () => {
    setError(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const filterStocks = () => {
    const res = stocks.filter((stock) => {
      if (
        props.editPart === null &&
        stock.Gramaje >= currentPart.minStockWeight &&
        stock.Gramaje <= currentPart.maxStockWeight
      ) {
        console.log(stock);
        return stock;
      } else if (
        props.editPart !== null &&
        stock.Gramaje >= currentPart.part.minStockWeight &&
        stock.Gramaje <= currentPart.part.maxStockWeight
      ) {
        console.log(stock);
        return stock;
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
    const part = partsList.find((item) => item._id === selectedValue);
    setCurrentPart(part);
    console.log(part);
    if (part?.PrintModAllowed === "Simplex") {
      setSimplex(true);
    } else {
      setSimplex(false);
    }
  };

  useEffect(() => {
    console.log(props.jobType);
    console.log(props.editPart);
    const updateStocks = async () => {
      await fechtData("materiales", setStocks);
      filterStocks();
    };

    console.log(props.parts);

    const filteredParts = props.job?.JobType
      ? props.parts.filter((part) =>
          part.jobTypesAllowed.includes(props.job.JobType.name)
        )
      : props.parts;

    try {
      //console.table(filteredParts);
      setPartsList(filteredParts);
      updateStocks();
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }, [setFilteredStocks, setPartsList, currentPart, setSimplex]);

  const failed = (
    <ErrorMessage message={useError.message} actiton={resetError} />
  );

  const success = (
    <Card raised sx={{ gap: "20px", maxWidth: "600px" }} color="secondary">
      <CardContent>
        <form
          name="form2"
          onSubmit={handleSubmit(
            props.editPart === null
              ? props.addParts
              : () => {
                  props.replacePart(
                    props.editPart?.index,
                    props.editPart?.part
                  );
                  props.setEditPart(null);
                }
          )}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 4, md: 8 }}
          >
            {partsList !== null && (
              <Grid item xs={1} sm={2} md={4}>
                <TextField
                  select
                  defaultValue={
                    props.editPart !== null
                      ? props.editPart.part.jobParts[0]._id
                      : ""
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
                      {part.Type}
                    </MenuItem>
                  ))}
                </TextField>
                {/* <FormControl sx={{ width: "90%" }}>
                  <InputLabel id="demo-simple-select-label">Partes</InputLabel>
                  <Controller // Usamos Controller de react-hook-form para el Select
                    name="jobParts"
                    {...register("jobParts", { required: true })}
                    control={control} // Proporcionamos el control del formulario
                    value={partsList[0]?._id}
                    render={({ field }) => (
                      <Select
                        label="Partes"
                        defaultValue={
                          props.editPart !== null
                            ? props.editPart.part.jobParts._id
                            : ""
                        }
                        {...field} // Aseguramos que las propiedades del campo sean manejadas por react-hook-form
                        onChange={(e) => {
                          handleChange(e.target.value); // Llamamos a nuestra función handleChange
                          field.onChange(e); // Importante llamar esto para que react-hook-form actualice los valores internamente
                        }}
                      >
                        {partsList.map((part) => (
                          <MenuItem value={part._id} key={part._id}>
                            {part.Type}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl> */}
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
                  maxLength: 85,
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
                <FormHelperText>Maximo 85 caracteres</FormHelperText>
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
              <TextField
                select
                defaultValue={
                  props.editPart !== null
                    ? props.editPart.part.jobParts[0]._id
                    : ""
                }
                id="partStock"
                inputProps={{
                  name: "partStock",
                  id: "partStock",
                }}
                variant="outlined"
                color="primary"
                label="Material"
                name="partStock"
                fullWidth
                {...register("partStock", { required: true })}
                onChange={props.onChange}
                /* onChange={(e) => {
                  handleChange(e.target.value); // Llamamos a nuestra función handleChange
                  //field.onChange(e); // Importante llamar esto para que react-hook-form actualice los valores internamente
                }} */
              >
                {filteredStocks.map((Stock) => (
                  <MenuItem value={Stock._id} id={Stock._id} key={Stock._id}>
                    {Stock.Nombre_Material} - {Stock.Marca}{" "}
                    {`(${Stock.Ancho_Resma} x ${Stock.Alto_Resma})`}
                  </MenuItem>
                ))}
              </TextField>
              {/* <FormControl sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-label">Material</InputLabel>
                <Select
                  name="partStock"
                  id="partStock"
                  label="Material"
                  onChange={props.onChange}
                  defaultValue={""}
                  variant="outlined"
                  sx={{ width: "95%" }}
                  color="secondary"
                  {...register("partStock", {
                    required: true,
                  })}
                >
                  {filteredStocks.map((Stock) => (
                    <MenuItem value={Stock._id} id={Stock._id} key={Stock._id}>
                      {Stock.Nombre_Material} - {Stock.Marca}{" "}
                      {`(${Stock.Ancho_Resma} x ${Stock.Alto_Resma})`}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ColoresDorso?.type === "required" && (
                  <FormHelperText>
                    Seleccione el material para la impresión.
                  </FormHelperText>
                )}
              </FormControl> */}
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
                  max: 4,
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
                  Como maximo podemos utilizar 4 tintas
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
                  max: 4,
                })}
              />
              {errors.ColoresDorso?.type === "max" && (
                <FormHelperText>
                  Como maximo podemos utilizar 4 tintas
                </FormHelperText>
              )}
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

  return !useError ? success : failed;
};

export default JobParts;
