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
  Divider,
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

  const [useValue, setMyValue] = useState({ value: ""});

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

          
          // Recorremos el dataForm y si hay un checkbox, cargamos el array en el estado, a ver si anda... Anduvo!
          for (let inp of props.form) {
            const checkOptions = (itemToEdit) ? {[inp.inputName]: itemToEdit.data[inp.inputName]} : {[inp.inputName]: []}
            if (inp.type === "checkbox" && props.task !== "new") {
              setSelectedCheckboxItems(checkOptions)
            } 
          }
          
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
      for (let inp of props.form) {
        
        if (inp.type === "checkbox") {
          console.log(inp.inputName, props.task)
          setSelectedCheckboxItems({[inp.inputName]: []})
        } 
      }
      console.log("new");
    }
  }, [setItem]);

  const submitHandler = async (e, collection, id) => {
    const datos = [];
    const names = Object.keys(e);
    const values = Object.values(e);

    console.log(names, values);

    // Collect data from inputs
    for (let i = 0; i < names.length; i++) {
      let nombre = names[i];
      let value = values[i];
      console.log(nombre, value);
      datos.push({ nombre, value });
    }
    console.log(datos);
    // Collct data from checkBox
    if(selectedCheckboxItems !== undefined) {
      for (const [nombre, value] of Object.entries(selectedCheckboxItems)) {
      const res = { nombre, value };
      datos.push(res);
    }
    }
    
    console.log(datos);

    const formData = convertirArrayAObjeto(datos);
    //formData.checkboxItems = selectedCheckboxItems;
    console.log("Formato del POST");
    console.log(formData);

    if (props.task === "new" || props.task === "copy") {
      try {
        await addPrivateElement(collection, formData);
        setHidden(true);
        navigate(-1);
        props.setState !== undefined
          ? props.setState(true)
          : console.log("No es nuevo");
      } catch (e) {
        setErrorMessage("No se pudo guardar " + e);
      }
    } else {
      try {
        await putPrivateElement(`${databaseURL}${collection}/${id}`, formData);
        setHidden(true);
        navigate(-1);
        //props.editor(true);
      } catch (e) {
        setErrorMessage("No se pudo actualizar" + e);
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
        <Grid item xs={4} sm={2} md={3}>
          <FormControl>
            <TextField
              id={inp.id}
              select
              label={inp.label || inp.inputName}
              variant="outlined"
              color="success"
              size="small"
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
        <Grid item xs={4} sm={4} md={6}>
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
      const changeHandler = (e, opt, checkboxSetKey) => {
        e.preventDefault();
        setMyValue({ value: e.target.value });
        setSelectedCheckboxItems((prevItems) => {
          const selectedItemsForSet = prevItems[checkboxSetKey] || [];

          if (e.target.checked) {
            // Agregar elemento a la lista de elementos seleccionados para el conjunto
            return {
              ...prevItems,
              [checkboxSetKey]: [...selectedItemsForSet, opt],
            };
          } else {
            // Remover elemento de la lista de elementos seleccionados para el conjunto
            return {
              ...prevItems,
              [checkboxSetKey]: selectedItemsForSet.filter(
                (item) => item !== opt
              ),
            };
          }
        });
      };

      return (
        <Grid item xs={4} sm={4} md={6}>
          <Card
            raised={false}
            sx={{
              p: 2,
              background: "none",
              border: "1px solid #555",
              borderRadius: "5px",
            }}
            variant="outlined"
          >
            <CardHeader subheader={inp.label || inp.inputName} />
            <CardContent>
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
                              // Esta ultima condicion hay que quitarla cuando se solucione el problema del checkbox
                              useItem.data !== undefined && useItem.data.jobTypesAllowed !== 0 
                                ? useItem.data[inp.inputName].includes(opt)
                                : false
                            }
                            onChange={(e) =>
                              changeHandler(e, opt, inp.inputName)
                            }
                          />
                        }
                        label={opt}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={4} sm={4} md={6}>
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
                step: (inp.step !== undefined ? inp.step : 1)
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
            subheader={props.task}
          />
          <Divider />
          <Box sx={{ p: 2 }}>
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
                    spacing={{ xs: 2, md: 4 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    sx={{ pb: 4 }}
                  >
                    {dataForm.map((inp) => typeOfInput(inp))}
                  </Grid>
                  <Divider />
                  <CardActions
                    sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}
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
          </Box>
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
