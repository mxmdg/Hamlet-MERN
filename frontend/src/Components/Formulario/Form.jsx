import { useState } from "react";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import axios from "axios";
import "./form.css";

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

const style = {
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

  let dataForm = props.form;

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

    if (props.task === "new" || props.task === "copy") {
      try {
        await axios.post(
          "http://localhost:5000/hamlet/" + collection,
          formData
        );
        setHidden(true);
        props.setState !== undefined
          ? props.setState(true)
          : console.log("No es nuevo");
      } catch (e) {
        console.log("No se pudo guardar " + e);
      }
    } else {
      //console.log(props.history);
      //historial !== undefined ? historial.push(history) : [];
      //formData.Historial = props.history;
      try {
        await axios.put(
          `http://localhost:5000/hamlet/${collection}/${id}`,
          formData
        );
        setHidden(true);
        props.editor(true);
      } catch (e) {
        console.log("No se pudeo actualizar" + e);
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
        <Select
          inputName={inp.inputName}
          key={inp.id}
          type={inp.type}
          value={value}
          changeHandler={changeHandler}
          options={inp.options}
        ></Select>
      );
    } else if (inp.type === "button") {
      return (
        <Button
          inputName={inp.inputName}
          key={inp.id}
          type={inp.type}
          selectForm={props.selectForm}
          id={"Register"}
        ></Button>
      );
    } else {
      return (
        <Input
          inputName={inp.inputName}
          key={inp.id}
          type={inp.type}
          step={inp.step !== undefined ? inp.step : 1}
          item={useItem !== {} ? useItem.data : ""}
        ></Input>
      );
    }
  };

  const hiddenTrue = (
    <div className="formulario">
      <button onClick={toogleHandler}>Agregar {props.collection}</button>
    </div>
  );

  const hiddenFalse = (
    <div style={style}>
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
        {dataForm.map((inp) => typeOfInput(inp))}
        <button id="submitBTN" type="submit">
          Enviar
        </button>
        <button id="cancelBTN" onClick={toogleHandler}>
          Cancelar
        </button>
      </form>
    </div>
  );

  return useHidden ? hiddenTrue : hiddenFalse;
};

export default Form;
