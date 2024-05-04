//React Imports

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

//Hamlet services imports

import { serverURL, databaseURL } from "../Config/config";
//import "./form.css";
import {
  addPrivateElement,
  getPrivateElments,
  getPrivateElementByID,
  putPrivateElement,
  deletePrivateElement,
} from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Hamlet Components Imports

import Spinner from "../General/Spinner";

//Input Components Imports

import Select from "./Select";
import Input from "./Input";

//MUI Material Imports

import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  Button,
  FormHelperText,
  InputLabel,
  MenuItem,
} from "@mui/material";

//Auxiliar Functions:

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
  const [useHidden, setHidden] = useState(
    props.task === "copy" || props.task === "edit" ? false : true
  );

  // Preloader State

  const [useLoading, setLoading] = useState(
    props.task === "new" ? false : true
  );

  // This state defines form's action: "copy", "edit" or "new"
  const [useItem, setItem] = useState(props.item || "new");

  // This state stores checkbox's selections
  const [selectedCheckboxItems, setSelectedCheckboxItems] = useState();

  // This state intializes chebox value
  const [useValue, setMyValue] = useState({ value: "" });

  // These states are used for navigation.
  const navigate = useNavigate();
  const params = useParams();

  // Error Manager State
  const [useErrorMessage, setErrorMessage] = useState(null);

  // In props.form you must provide the object model
  let dataForm = props.form;

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    mode: "onChange", //"onBlur",
    defaultValues: useItem,
  });

  useEffect(() => {
    if (
      (props.item === undefined && props.task === "edit") ||
      props.task === "copy"
    ) {
      const { id } = params;

      const fetchItem = async () => {
        setLoading(true);

        try {
          const itemToEdit = await getPrivateElementByID(
            `${props.collection}`,
            id
          );

          setItem(itemToEdit);
          setLoading(false);

          console.log(dataForm);
        } catch (e) {
          setErrorMessage(e.message);
        }
      };
      fetchItem();
    } else if (props.item) {
      console.log(useItem);
    } else {
      console.log("new");
    }
  }, [setItem]);

  const submitHandlerTest = async (values, collection, id) => {
    console.log(values, collection, id);

    if (props.task === "new" || props.task === "copy") {
      try {
        await addPrivateElement(collection, values);
        setHidden(true);
        navigate(-1);
        props.setState !== undefined
          ? props.setState(true)
          : console.log("No es nuevo");
      } catch (e) {
        console.log(e);
        setErrorMessage("No se pudo guardar: " + e.message);
        return e;
      }
    }
  };

  const submitHandler = async (values, collection, id) => {
    console.log(values);
    const datos = [];

    if (props.task === "new" || props.task === "copy") {
      try {
        await addPrivateElement(collection, values);
        setHidden(true);
        navigate(-1);
        props.setState !== undefined
          ? props.setState(true)
          : console.log("No es nuevo");
      } catch (e) {
        console.log(e);
        setErrorMessage("No se pudo guardar: " + e.message);
        return e;
      }
    } else {
      try {
        await putPrivateElement(`${databaseURL}${collection}/${id}`, values);
        setHidden(true);
        navigate(-1);
        props.editor(true);
      } catch (e) {
        console.log(e);
        setErrorMessage("No se pudo actualizar: " + e.message);
        return e;
      }
    }
    try {
      typeof props.view === "function"
        ? props.view("viewer")
        : props.view("editor");
    } catch (e) {
      console.log(e);
      setErrorMessage(e.message);
    }
  };

  const toogleHandler = () => {
    setHidden(!useHidden);
    props.setState !== undefined
      ? props.setState(false)
      : console.log("no setState");
    try {
      typeof props.view === "function"
        ? props.view("viewer")
        : props.view("editor");
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const resetError = () => {
    console.log("resetError");
    setErrorMessage(null);
    //navigate(-1);
  };

  const typeOfInput = (inp) => {
    if (inp.type === "Select") {
      let value;
      const changeHandler = (e) => {
        e.preventDefault();
        return (value = e.target.value);
      };
      return (
        <Grid item xs={1} sm={2} md={4}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField
              id={inp.id}
              select
              label={inp.label || inp.inputName}
              variant="filled"
              color="success"
              defaultValue={
                useItem !== "new" ? useItem.data[inp.inputName] : ""
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
              }}
              fullWidth
            >
              {inp.options.map((u) => {
                return (
                  <MenuItem value={u.value} key={u.id}>
                    {u.text}
                  </MenuItem>
                );
              })}
            </TextField>
            <FormHelperText>Elija una opción</FormHelperText>
          </FormControl>
        </Grid>
      );
    } else if (inp.type === "button") {
      return (
        <Grid item xs={1} sm={2} md={4}>
          <Button
            variant="outlined"
            inputName={inp.inputName}
            color="primary"
            key={inp.id}
            type={inp.type}
            selectForm={props.selectForm}
            id={inp.id}
            fullWidth
          >
            {inp.label || inp.inputName}
          </Button>
        </Grid>
      );
    } else if (inp.type === "checkbox") {
      const changeHandler = (e) => {
        setSelectedCheckboxItems({ [inp.inputName]: [] });
        console.log(e.target.value, e.target.checked, inp.inputName);
        if (e.target.checked) {
          selectedCheckboxItems[inp.inputName].push(e.target.value);
          console.log(selectedCheckboxItems);
        }
      };

      return (
        <Grid item xs={1} sm={4} md={8}>
          <FormControl
            label={inp.label || inp.inputName}
            inputname={inp.inputName}
            id={inp.inputName}
          >
            <FormGroup label={inp.label || inp.inputName}>
              {inp.options.map((opt, index) => {
                //console.log(useItem.data[inp.inputName][index]);
                //console.log(useItem.data[inp.inputName].includes(opt));
                return (
                  <FormControlLabel
                    key={inp.inputName + index}
                    control={
                      <Checkbox
                        color="primary"
                        key={inp.inputName + "_" + index}
                        id={"id_" + inp.inputName + index} // Asegúrate de que cada checkbox tenga un ID único
                        //defaultChecked={false}
                        value={[opt]}
                        defaultChecked={
                          useItem.data !== undefined
                            ? useItem.data[inp.inputName].includes(opt)
                            : false
                        }
                        onChange={(e) => changeHandler(e)}
                      />
                    }
                    label={opt}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            id={inp.id}
            type={inp.type}
            label={inp.label || inp.inputName}
            variant="outlined"
            defaultValue={useItem !== "new" ? useItem.data[inp.inputName] : ""}
            name={inp.inputName}
            {...register(inp.inputName)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                placeholder: "",
              },
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
        <Card raised>
          <CardHeader
            component="div"
            title={props.collection}
            subheader={props.Task}
          />
          <CardContent>
            <FormControl>
              <form
                onSubmit={handleSubmit((values) => {
                  submitHandler(
                    values,
                    props.collection,
                    useItem !== "new" ? useItem.data._id : ""
                  );
                })}
              >
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {dataForm.map((inp) => typeOfInput(inp))}
                </Grid>
                <CardActions
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    id="submitBTN"
                    color="primary"
                    type="submit"
                  >
                    Enviar
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
        </Card>
      </Container>
    );
  };

  const alertError = (
    <ErrorMessage
      message={useErrorMessage}
      severity={"error"}
      action={resetError}
    />
  );

  //return useHidden ? hiddenTrue : hiddenFalse;
  return useLoading
    ? loadingItemToEdit
    : useErrorMessage !== null
    ? alertError
    : hiddenFalse();
};

export default FormMaterial;
