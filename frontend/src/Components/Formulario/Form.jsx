//React Imports

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//Hamlet services imports

import { serverURL, databaseURL } from "../Config/config";
import "./form.css";
import {
  addPrivateElement,
  getPrivateElments,
  getPrivateElementByID,
  putPrivateElement,
  deletePrivateElement,
} from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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

// CSS Style (Never read...)

let style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  border: "1px solid #839",
  background: "#000",
  backDropFilter: "blur(5px)",
  boxShadow: "13px 13px 15px #00000088",
  padding: "10px",
  borderRadius: "10px",
  zIndex: "10",
};

//  ¡¡¡Form Maker Component!!!

const Form = (props) => {
  const [useHidden, setHidden] = useState(
    props.task === "copy" || props.task === "edit" ? false : true
  );

  // This state defines form's action: "copy", "edit" or "new"
  const [useItem, setItem] = useState(props.item || "new");

  // This state stores checkbox's selections
  const [selectedCheckboxItems, setSelectedCheckboxItems] = useState({});

  // This state intializes chebox value

  const [useValue, setValue] = useState({ value: "" });

  // These states are used for navigation.
  const navigate = useNavigate();
  const params = useParams();

  // Error Manager State

  const [useErrorMessage, setErrorMessage] = useState(null);

  // In props.form you must provide the object model for the form
  let dataForm = props.form;

  useEffect(() => {
    if (
      (props.item === undefined && props.task === "edit") ||
      props.task === "copy"
    ) {
      const { id } = params;

      const fetchItem = async () => {
        try {
          const itemToEdit = await getPrivateElementByID(
            `${props.collection}`,
            id
          );
          setItem(itemToEdit);
        } catch (e) {
          setErrorMessage(e);
        }
      };
      fetchItem();
    } else if (props.item) {
      console.log(useItem);
    } else {
      console.log("new");
    }
  }, [setItem]);

  const submitHandler = async (e, collection, id) => {
    e.preventDefault();

    const datos = [];

    // Collect data from inputs
    for (let element of e.target.elements) {
      if (element.tagName === "INPUT" || element.tagName === "SELECT") {
        let nombre = element.id;
        let value = element.value;
        datos.push({ nombre, value });
      }
    }

    // Collct data from checkBox
    for (const [nombre, value] of Object.entries(selectedCheckboxItems)) {
      const res = { nombre, value };
      datos.push(res);
    }
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
        console.log(e);
        setErrorMessage(e.response.data);
        return e;
      }
    } else {
      try {
        await putPrivateElement(`${databaseURL}${collection}/${id}`, formData);
        setHidden(true);
        navigate(-1);
        props.editor(true);
      } catch (e) {
        console.log(e);
        setErrorMessage("No se pudo actualizar: " + e.response?.data);
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
    console.log(inp);
    if (inp.type === "Select") {
      let value;
      const changeHandler = (e) => {
        e.preventDefault();
        return (value = e.target.value);
      };
      return (
        <Grid item xs={1} sm={2} md={4}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            {/*<InputLabel id={inp.id}>{inp.inputName}</InputLabel>
              <Select
                  labelId={inp.id}
                  placeholder={inp.inputName}
                  color="primary"
                  id={inp.id}
                  value={value}
                  label={value}
                  onChange={changeHandler}
                  fullWidth
                >
              {inp.options.map((opt) => {
                return (
                  <MenuItem value={opt.value}>
                    <em>{opt.text}</em>
                  </MenuItem>
                );
              })}
            </Select>*/}
            <Select
              inputName={inp.inputName}
              changeHandler={changeHandler}
              options={inp.options}
              value={value}
            />
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
            {inp.inputName}
          </Button>
        </Grid>
      );
    } else if (inp.type === "checkbox") {
      const changeHandler = (e, opt, checkboxSetKey) => {
        e.preventDefault();
        setValue({ value: e.target.value });
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
        <Grid item xs={1} sm={4} md={8}>
          <FormControl
            label={inp.inputName}
            inputname={inp.inputName}
            id={inp.inputName}
          >
            <FormGroup>
              {inp.options.map((opt, index) => {
                return (
                  <FormControlLabel
                    key={inp.inputName + index}
                    control={
                      <Checkbox
                        color="primary"
                        value={useValue}
                        key={inp.inputName + index}
                        id={inp.inputName + index} // Asegúrate de que cada checkbox tenga un ID único
                        //defaultChecked={false}
                        checked={
                          selectedCheckboxItems[inp.inputName] &&
                          selectedCheckboxItems[inp.inputName].includes(opt)
                        }
                        onChange={(e) => changeHandler(e, opt, inp.inputName)}
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
          <Input
            inputName={inp.inputName}
            color="primary"
            key={inp.id}
            type={inp.type}
            step={inp.step !== undefined ? inp.step : 1}
            item={typeof useItem !== Object ? useItem.data : ""}
            fullWidth
          ></Input>
        </Grid>
      );
    }
  };

  const hiddenTrue = (
    <div className="formulario">
      <button onClick={toogleHandler}>Agregar {props.collection}</button>
    </div>
  );

  const hiddenFalse = (
    <Container>
      <Card raised>
        <CardHeader
          component="div"
          title={props.collection}
          subheader={props.Task}
        />
        <CardContent>
          <div>
            <form
              onSubmit={(e) =>
                submitHandler(
                  e,
                  props.collection,
                  useItem !== "new" ? useItem.data._id : ""
                )
              }
              className="formulario"
            >
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {dataForm.map((inp) => typeOfInput(inp))}
              </Grid>
              <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  id="submitBTN"
                  color="primary"
                  type="submit"
                >
                  Enviar
                </Button>
                <Button
                  variant="outlined"
                  id="cancelBTN"
                  color="warning"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
              </CardActions>
            </form>
          </div>
        </CardContent>
      </Card>
    </Container>
  );

  const alertError = (
    <ErrorMessage
      message={useErrorMessage}
      severity={"error"}
      action={resetError}
    />
  );

  //return useHidden ? hiddenTrue : hiddenFalse;
  return useErrorMessage !== null ? alertError : hiddenFalse;
};

export default Form;
