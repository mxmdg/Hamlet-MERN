import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { getPrivateElementByID } from "../customHooks/FetchDataHook";

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

const Form = (props) => {
  const [hidden, setHidden] = useState(
    props.task === "copy" || props.task === "edit" ? false : true
  );
  const [item, setItem] = useState(props.item || "new");
  const [selectedCheckboxItems, setSelectedCheckboxItems] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

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
          setErrorMessage(e.message);
        }
      };
      fetchItem();
    }
  }, [setItem]);

  const handleCheckboxChange = (event) => {
    setSelectedCheckboxItems({
      ...selectedCheckboxItems,
      [event.target.name]: event.target.checked,
    });
  };

  const submitHandler = async (e) => {
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

    // Collect data from checkBox
    for (const [nombre, value] of Object.entries(selectedCheckboxItems)) {
      const res = { nombre, value };
      datos.push(res);
    }
    const formData = convertirArrayAObjeto(datos);

    // Aquí puedes implementar la lógica para interactuar con tu base de datos
    // Puedes usar 'props.collection' y 'props.task' para determinar qué operación de CRUD realizar
  };

  return (
    <form onSubmit={submitHandler}>
      {props.form.map((dato) => {
        switch (dato.type) {
          case "Text":
            return (
              <div key={dato.id}>
                <TextField label={dato.inputName} variant="outlined" />
              </div>
            );
          case "number":
            return (
              <div key={dato.id}>
                <TextField
                  label={dato.inputName}
                  type="number"
                  variant="outlined"
                />
              </div>
            );
          case "Select":
            return (
              <div key={dato.id}>
                <FormControl variant="outlined">
                  <InputLabel>{dato.inputName}</InputLabel>
                  <Select label={dato.inputName}>
                    {dato.options.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            );
          case "checkbox":
            return (
              <div key={dato.id}>
                <FormControl component="fieldset">
                  <InputLabel>{dato.inputName}</InputLabel>
                  {dato.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={selectedCheckboxItems[option] || false}
                          onChange={handleCheckboxChange}
                          name={option}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormControl>
              </div>
            );
          default:
            return null;
        }
      })}
    </form>
  );
};

export default Form;
