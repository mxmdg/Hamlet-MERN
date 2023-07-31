import { useEffect, useState } from "react";
import { Navigate, useParams } from 'react-router-dom';
import Input from "./Input";
import axios from "axios";
import { serverURL } from "../Config/config";
import "./form.css";
import { getElement } from "../General/DBServices";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import ButtonGroup from "@mui/material/ButtonGroup";
import { Container, Box, Grid, Card, CardContent, CardActions, CardHeader, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate()  
  const params = useParams()

  let dataForm = props.form;


  useEffect(()=>{
     if (props.item === undefined && props.task === 'edit' || props.task === 'copy') {
    
      const { id } = params;

      const fetchItem = async ()=>{
        try {
        const itemToEdit = await axios.get(
          `${serverURL}/hamlet/${props.collection}/${id}`
        );
        setItem(itemToEdit);
        console.log("id: " + itemToEdit.data._id);
        console.log("Coleccion: " + props.collection)
      } catch (e) {
        console.log(e);
      }
      }
      fetchItem()
    } else if (props.item) {
      console.log(useItem)
    } else {
      console.log('new')
    }
  },[setItem])

  
 
  

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
        navigate(-1)
        props.setState !== undefined
          ? props.setState(true)
          : console.log("No es nuevo");
      } catch (e) {
        console.log("No se pudo guardar " + e);
      }
    } else {
      try {
        await axios.put(
          `http://localhost:5000/hamlet/${collection}/${id}`,
          formData
        );
        setHidden(true);
        navigate(-1)
        props.editor(true);
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
        <Grid item xs={2} md={4}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id={inp.id}>{inp.inputName}</InputLabel>
            <Select
              labelId={inp.id}
              id={inp.id}
              value={value}
              label={value}
              onChange={changeHandler}
            >
              {inp.options.map((opt)=>{
              return (<MenuItem value={opt.value}>
                <em>{opt.text}</em>
              </MenuItem>)
              })}
            </Select>
        <FormHelperText>Elija una opción</FormHelperText>
      </FormControl>
        </Grid>
        
        
      );
    } else if (inp.type === "button") {
      return (
        <Button
          variant="outlined"
          inputName={inp.inputName}
          key={inp.id}
          type={inp.type}
          selectForm={props.selectForm}
          id={inp.id}
        >{inp.inputName}</Button>
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
    <Container >
      <Card raised>
        <CardHeader component="div" title={props.collection} subheader={props.Task} />
        <CardContent>
            <div {...props.task !== 'new'?style={style}:''}>
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
              
                <Grid container>
                  {dataForm.map((inp) => typeOfInput(inp))}
                  <ButtonGroup variant="outlined" color="warning" aria-label="text button group">
                          <Button id="submitBTN" type="submit">
                            Enviar
                          </Button>
                          <Button id="cancelBTN" onClick={()=>navigate(-1)}>
                            Cancelar
                          </Button>
                  </ButtonGroup>
                </Grid>
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
