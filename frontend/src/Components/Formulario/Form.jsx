import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "./Input";
import { serverURL, databaseURL } from "../Config/config";
import "./form.css";
import {
  addPrivateElement,
  getPrivateElments,
  getPrivateElementByID,
  putPrivateElement,
  deletePrivateElement,
} from "../customHooks/FetchDataHook";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function convertirArrayAObjeto(arr) {
  return arr.reduce((obj, item) => {
    const propName =
      item.nombre || item.Nombre_material || item.Modelo || item.Proceso;
    const propValue = isNaN(item.value)
      ? item.value.toLowerCase()
      : Number(item.value);

    obj[propName] = propValue;

    return obj;
  }, {});
}

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

const Form = (props) => {
  const [useHidden, setHidden] = useState(
    props.task === "copy" || props.task === "edit" ? false : true
  );
  const [useItem, setItem] = useState(props.item || "new");
  const navigate = useNavigate();
  const params = useParams();

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
          console.log(itemToEdit);
          setItem(itemToEdit);
          console.log("id: " + itemToEdit.data.id);
          console.log("Coleccion: " + props.collection);
        } catch (e) {
          console.log(e);
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
    for (let element of e.target.elements) {
      if (element.tagName === "INPUT" || element.tagName === "SELECT") {
        let nombre = element.placeholder;
        let value = element.value;
        datos.push({ nombre, value });
      }
    }
    const formData = convertirArrayAObjeto(datos);
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
        console.log("No se pudo guardar " + e);
      }
    } else {
      try {
        await putPrivateElement(`${databaseURL}${collection}/${id}`, formData);
        setHidden(true);
        navigate(-1);
        //props.editor(true);
      } catch (e) {
        console.log("No se pudo actualizar" + e);
      }
    }
    console.log("View Prop of Form: " + props.view);
    try {
      typeof props.view === "function"
        ? props.view("viewer")
        : props.view("editor");
    } catch (e) {
      console.log("There is no props.view");
      console.log(e);
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
      console.log("There is no props.view");
      console.log(e);
    }
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
            <InputLabel id={inp.id}>{inp.inputName}</InputLabel>
            <Select
              labelId={inp.id}
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
            </Select>
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
    } else {
      return (
        <Grid item xs={12} sm={3} md={3}>
          <Input
            inputName={inp.inputName}
            color="primary"
            key={inp.id}
            type={inp.type}
            step={inp.step !== undefined ? inp.step : 1}
            item={useItem !== {} ? useItem.data : ""}
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
          <div {...(props.task !== "new" ? (style = { style }) : "")}>
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

  //return useHidden ? hiddenTrue : hiddenFalse;
  return hiddenFalse;
};

export default Form;
