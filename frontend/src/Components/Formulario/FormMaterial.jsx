//React Imports

import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

//Hamlet services imports

import { serverURL, HAMLET_API } from "../Config/config";
//import "./form.css";
import {
  addPrivateElement,
  getPrivateElementByID,
  putPrivateElement,
} from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Hamlet Components Imports

import Spinner from "../General/Spinner";
import SmartMeasureInput from "./SmartMeasureInput";

//MUI Material Imports

import {
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  Button,
  FormHelperText,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { StyledTooltip } from "../General/TableGrid";

//Auxiliar Functions:

const normalizeCheckboxItems = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return value ? [value] : [];
  return [];
};

function convertirArrayAObjeto(arr) {
  return arr.reduce((obj, item) => {
    const propName =
      item.nombre || item.Nombre_material || item.Modelo || item.Proceso;
    const propValue = isNaN(item.value)
      ? typeof item.value !== String
        ? item.value
        : item.value.toLowerCase()
      : Number(item.value);

    obj[propName] = propValue;

    return obj;
  }, {});
}

//  ¡¡¡Form Maker Component!!!

const FormMaterial = (props) => {
  // Preloader State

  const [useLoading, setLoading] = useState(
    props.task === "new" ? false : props.task === "local" ? false : true,
  );

  // This state defines form's action: "copy", "edit" or "new"
  const [useItem, setItem] = useState(props.item || "new");

  // This state stores checkbox's selections
  const [selectedCheckboxItems, setSelectedCheckboxItems] = useState([]);

  // This state intializes chebox value

  const [useValue, setMyValue] = useState({ value: "" });

  // These states are used for navigation.
  const navigate = useNavigate();
  const params = useParams();

  // Error Manager State
  const [useErrorMessage, setErrorMessage] = useState(null);

  // In props.form you must provide the object model
  let dataForm = props.form;

  //New props.variant to define the form variant
  const variant = props.variant || "standard";
  // new color prop (default primary)
  const color = props.color || "primary";
  // Subtitle prop
  const [useSubTitle, setSubTitle] = [props.subtitle || props.task];

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    control,
  } = useForm({
    mode: "onChange", //"onBlur",
    defaultValues: useItem,
  });

  useEffect(() => {
    if (
      (props.item === undefined && props.task === "edit") ||
      props.task === "copy"
    ) {
      const { id } = params || props.id;

      const fetchItem = async () => {
        //setLoading(true);
        try {
          const itemToEdit = await getPrivateElementByID(
            `${props.collection}`,
            id,
          );
          setItem(itemToEdit);
          //console.log(itemToEdit);
          itemToEdit === undefined && setErrorMessage("Item no encontrado");

          // Recorremos el dataForm y si hay un checkbox, cargamos el array en el estado, a ver si anda... Anduvo!
          try {
            const checkOptions = {};
            for (let inp of dataForm) {
              if (inp.type === "checkbox") {
                itemToEdit !== "new" && itemToEdit !== undefined
                  ? (checkOptions[inp.inputName] = normalizeCheckboxItems(itemToEdit[inp.inputName]))
                  : (checkOptions[inp.inputName] = []);
              }
              if (inp.type === "checkbox" && props.task !== "new") {
                setSelectedCheckboxItems(checkOptions);
              }
            }
          } catch (e) {
            setErrorMessage(e.response?.data || e.message);
            setLoading(false);
          }

          setLoading(false);

          //console.log(dataForm);
        } catch (e) {
          setErrorMessage(e.response?.data || e.message);
          setLoading(false);
        }
      };
      fetchItem();
    } else if (props.item) {
      const checkOptions = {};
      for (let inp of dataForm) {
        if (inp.type === "checkbox") {
          checkOptions[inp.inputName] = normalizeCheckboxItems(props.item[inp.inputName]);
        }
      }
      setSelectedCheckboxItems(checkOptions);
      setLoading(false);
    } else {
      for (let inp of props.form) {
        if (inp.type === "checkbox") {
          setSelectedCheckboxItems({ [inp.inputName]: [] });
        }
      }
    }
  }, [setItem]);

  useEffect(() => {
    if (props.task === "local" && useItem) {
      setItem(useItem);
      setLoading(false);
    }
  }, [useItem, props.task]);

  const submitHandler = async (e, collection, id) => {
    const datos = [];
    const names = Object.keys(e);
    const values = Object.values(e);

    //console.log(names, values);

    // Collect data from inputs
    for (let i = 0; i < names.length; i++) {
      let nombre = names[i];
      let value = values[i];
      //console.log(nombre, value);
      datos.push({ nombre, value });
    }
    // console.log(datos);
    // Collct data from checkBox
    if (selectedCheckboxItems !== undefined) {
      for (const [nombre, value] of Object.entries(selectedCheckboxItems)) {
        const res = { nombre, value };
        datos.push(res);
      }
    }
    //console.log("Datos from Chekbox");
    //console.log(datos);

    const formData = convertirArrayAObjeto(datos);
    //formData.checkboxItems = selectedCheckboxItems;

    if (props.task === "new" || props.task === "copy") {
      try {
        const response = await addPrivateElement(collection, formData);
        //console.log(response);
        setErrorMessage({
          message: response.data.message,
          color: "success",
        });
        //navigate(-1);
        if (props.setState !== undefined) {
          props.setState(true);
        }
      } catch (e) {
        setErrorMessage(e.response?.data?.message || e.message);
      }
    } else {
      try {
        await putPrivateElement(`${HAMLET_API}${collection}/${id}`, formData);
        navigate(-1);
        //props.editor(true);
      } catch (e) {
        setErrorMessage(e.response?.data || e.message);
      }
    }
    /* try {
      typeof props.view === "function"
        ? props.view("viewer")
        : props.view("editor");
    } catch (e) {
      setErrorMessage("There is no props.view" + e);
    } */
  };

  const resetError = () => {
    setErrorMessage(null);
    navigate(-1);
  };

  const typeOfInput = (inp) => {
    if (inp.type === "Select") {
      let value;

      return (
        <Grid size={inp.size || { xs: 12, sm: 6, md: 6 }}>
          <FormControl key={inp.id}>
            <TextField
              id={inp.id}
              select
              label={inp.label || inp.inputName}
              variant={variant}
              color={inp?.color || color}
              size="small"
              defaultValue={
                useItem !== "new"
                  ? useItem[inp.inputName]?._id || useItem[inp.inputName]
                  : ""
              }
              autoComplete={inp.inputName}
              name={inp.inputName}
              {...(inp.onChange ? { onChange: inp.onChange } : {})}
              {...register(inp.inputName)}
            >
              {inp.options.map((u, index) => {
                return (
                  <MenuItem value={u.value} key={u.text + index}>
                    {u.text}
                  </MenuItem>
                );
              })}
            </TextField>
            <FormHelperText>Elija una opción</FormHelperText>
            {errors[inp.id]?.type === "required" && (
              <FormHelperText>Este campo es requerido</FormHelperText>
            )}
          </FormControl>
        </Grid>
      );
    } else if (inp.type === "button") {
      return (
        <Grid size={{ xs: 4, sm: 4, md: 6 }}>
          <Button
            variant={variant}
            inputName={inp.inputName}
              color={inp?.color || color}
            key={inp.id}
            type={inp.type}
            selectForm={props.selectForm}
            id={inp.id}
            onClick={inp.clickHandler}
            fullWidth
          >
            {inp.label || inp.inputName}
          </Button>
        </Grid>
      );
    } else if (inp.type === "checkbox") {
      const selectedOptions = normalizeCheckboxItems(
        selectedCheckboxItems[inp.inputName],
      );
      const allSelected =
        useItem !== "new" && inp.options.length === selectedOptions.length;

      const getOptionValue = (option) =>
        typeof option === "object" && option !== null
          ? option.value
          : option;
      const getOptionLabel = (option) =>
        typeof option === "object" && option !== null
          ? option.text
          : option;

      const changeHandler = (e, opt, checkboxSetKey) => {
        e.preventDefault();
        const optionValue = getOptionValue(opt);
        setMyValue({ [checkboxSetKey]: optionValue });
        setSelectedCheckboxItems((prevItems) => {
          const selectedItemsForSet = prevItems[checkboxSetKey] || [];

          if (e.target.checked) {
            return {
              ...prevItems,
              [checkboxSetKey]: [...selectedItemsForSet, optionValue],
            };
          }
          return {
            ...prevItems,
            [checkboxSetKey]: selectedItemsForSet.filter(
              (item) => item !== optionValue,
            ),
          };
        });
      };

      const handleChange1 = (event, checkboxSetKey) => {
        const isChecked = event.target.checked;
        setSelectedCheckboxItems((prevItems) => ({
          ...prevItems,
          [checkboxSetKey]: isChecked ? inp.options.map(getOptionValue) : [],
        }));
      };

      return (
        <Grid size={inp.size || 12}>
          <Card
            raised={false}
            /* sx={{
              p: 2,
              background: "none",
              border: "1px solid #555",
              borderRadius: "5px",
            }} */
            variant={variant}
          >
            <CardHeader subheader={inp.label || inp.inputName} />
            <CardContent>
              <FormControl
                label={inp.label || inp.inputName}
                inputname={inp.inputName}
                id={inp.inputName}
              >
                <StyledTooltip
                  title="Atencion! esta accion no se puede deshacer"
                  placement="top-start"
                >
                  <FormControlLabel
                    label={
                      allSelected ? "Deseleccionar todo" : "Seleccionar todo"
                    }
                    key={inp.inputName + "_all"}
                    control={
                      <Checkbox
                        variant={variant}
                        color={color}
                        indeterminate={
                          selectedOptions.length > 0 &&
                          selectedOptions.length < inp.options.length
                        }
                        checked={
                          selectedOptions.length === inp.options.length
                        }
                        onChange={(e) => {
                          handleChange1(e, inp.inputName);
                        }}
                      />
                    }
                  />
                </StyledTooltip>
                <FormGroup label={inp.label || inp.inputName}>
                  <Grid container columns={12}>
                    {[...inp.options]
                      .sort((a, b) =>
                        String(getOptionLabel(a)).localeCompare(
                          String(getOptionLabel(b)),
                        ),
                      )
                      .map((opt, index) => {
                        const optionValue = getOptionValue(opt);
                        const optionLabel = getOptionLabel(opt);
                        return (
                          <Grid
                            key={optionValue ?? index + inp.inputName}
                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color={color}
                                  id={"id_" + inp.inputName + index}
                                  value={optionValue}
                                  checked={
                                    selectedOptions.includes(optionValue) || false
                                  }
                                  onChange={(e) =>
                                    changeHandler(e, opt, inp.inputName)
                                  }
                                />
                              }
                              label={optionLabel}
                              labelPlacement="end"
                            />
                          </Grid>
                        );
                      })}
                  </Grid>
                  {errors[inp.id]?.type === "required" && (
                    <FormHelperText>Este campo es requerido</FormHelperText>
                  )}
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      );
    } else if (inp.type === "Divider") {
      return (
        <Grid size={inp.size || 12}>
          <Divider
            color={inp?.color || color}
            textAlign={inp.align || "center"}
            orientation={inp.orientation || "horizontal"}
            sx={{ margin: "15px 0 10px 0" }}
          >
            {inp.label && (
              <Typography variant={"button"} color={inp?.color || color}>
                {inp.label || ""}
              </Typography>
            )}
          </Divider>
        </Grid>
      );
    } else if (inp.type === "SmartMeasure") {
      return (
        <Grid size={inp.size || { xs: 4, sm: 4, md: 6 }} key={inp.inputName}>
          <Controller
            name={inp.inputName}
            control={control} // Asegúrate de que 'control' esté disponible en FormMaterial
            defaultValue={
              useItem !== "new" ? useItem[inp.inputName] : (inp.default ?? "") // Evitamos el undefined con ?? ""
            }
            render={({ field: { onChange, value, onBlur } }) => (
              <SmartMeasureInput
                id={inp.id}
                variant={variant}
                color={color}
                subtype={inp.subtype}
                label={inp.label || inp.inputName}
                value={value ?? ""} // Forzamos que siempre sea al menos un string vacío
                onChange={onChange}
                onBlur={onBlur} // Esto soluciona el error de 'reading name' en el blur
                error={!!errors[inp.inputName]}
                helperText={errors[inp.inputName]?.message}
              />
            )}
          />
        </Grid>
      );
    } else {
      return (
        <Grid size={inp.size || { xs: 4, sm: 4, md: 6 }}>
          <TextField
            id={inp.id}
            type={inp.type}
            label={inp.label || inp.inputName}
            autoComplete={inp.inputName}
            multiline={inp.multiline || false}
            variant={variant}
              color={inp?.color || color}
            defaultValue={
              useItem !== "new"
                ? useItem[inp.inputName]
                : inp.default
                  ? inp.default
                  : ""
            }
            name={inp.inputName}
            {...register(inp.inputName)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                placeholder: "",
              },
              step: inp.step !== undefined ? inp.step : 1,
            }}
            fullWidth
          />
          {errors[inp.inputName] && (
            <FormHelperText>
              <Typography variant="body1"> {inp.help || ""}</Typography>
            </FormHelperText>
          )}
        </Grid>
      );
    }
  };

  const loadingItemToEdit = <Spinner color="secondary" />;

  const hiddenFalse = () => {
    return (
      <Container>
        <Card variant={props.variant}>
          <CardHeader
            component="div"
            title={props.title || props.collection}
            subheader={useSubTitle}
          />
          <Divider />
          <Box sx={{ p: 2 }}>
            <CardContent>
              <FormControl>
                <form
                  onSubmit={handleSubmit((values) => {
                    if (props.action) {
                      props.action(values);
                    } else {
                      submitHandler(
                        values,
                        props.collection,
                        useItem !== "new" ? useItem._id : "",
                      );
                    }
                  })}
                >
                  <Grid
                    container
                    spacing={{ xs: 2, sm: 4 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    sx={{ pb: 4 }}
                  >
                    {dataForm.map((inp, index) => (
                      <Fragment key={index}>{typeOfInput(inp)}</Fragment>
                    ))}
                  </Grid>
                  <Divider />
                  <CardActions
                    sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
                  >
                    <Button
                      variant="contained"
                      id="submitBTN"
                      color={color}
                      type="submit"
                    >
                      {props.submitText || "Enviar"}
                    </Button>
                    <Button
                      variant="contained"
                      id="cancelBTN"
                      color="error"
                      onClick={() => navigate(-1)}
                    >
                      Cancelar
                    </Button>
                  </CardActions>
                </form>
              </FormControl>
            </CardContent>
          </Box>
        </Card>
      </Container>
    );
  };

  const alertError = (
    <ErrorMessage
      message={useErrorMessage}
      severity={useErrorMessage?.color || "error"}
      action={resetError}
      title="Respuesta"
    />
  );

  useEffect(() => {}, [selectedCheckboxItems, useValue]);

  //return useHidden ? hiddenTrue : hiddenFalse;
  return useLoading
    ? loadingItemToEdit
    : useErrorMessage !== null
      ? alertError
      : hiddenFalse();
};

export default FormMaterial;
