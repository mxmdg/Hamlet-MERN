import "../../Styles/hamlet.css";
import axios from "axios";
import { serverURL } from "../Config/config";
import Form from "../Formulario/Form";
import { useState, useEffect } from "react";
//import { DataGrid } from '@mui/x-data-grid';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const ItemsDetails = (props) => {
  const [useView, setView] = useState("viewer");
  const [useItemToEdit, setItemToEdit] = useState({});
  const [useTask, setTask] = useState("new");
  const navigate = useNavigate()
  const getElements = async () => {
    const items = await axios.get(`${serverURL}/hamlet/${props.collection}/`);
  };

  //console.log(props.formCLC?props.formCLC:"")

  const deleteClickHandler = async (id) => {
    if (
      window.confirm(
        `Estas recontra seguro de borrar ${
          props.pd.Nombre ||
          props.pd.Nombre_Material ||
          props.pd.Modelo ||
          props.pd.Proceso
        }`
      )
    ) {
      try {
        await axios.delete(`${serverURL}/hamlet/${props.collection}/${id}`);
        getElements();
        props.editor("deleted");
      } catch (e) {
        alert(e);
      }
    }
  };

  const editClickHandler = async (id) => {
    try {
      const itemToEdit = await axios.get(
        `${serverURL}/hamlet/${props.collection}/${id}`
      );
      setTask("edit");
      props.editor("edited");
      setView("editor");
      setItemToEdit(itemToEdit);
      console.log("id: " + itemToEdit.data._id);
    } catch (e) {
      console.log(e);
    }
  };

  // const rows: GridRowsProp = props.pd

  const copyClickHandler = async (id) => {

    
    try {
      const itemToEdit = await axios.get(
        `${serverURL}/hamlet/${props.collection}/${id}`
      );
      setTask("copy");
      props.editor("copied");
      setView("editor");
      setItemToEdit(itemToEdit);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {}, [props.editor, useView, useTask]);

  const editor = (
    <Form
      form={props.formData}
      collection={props.collection}
      item={useItemToEdit}
      view={setView}
      task={useTask}
      _id={props.pd._id}
    />
  );

  const viewer = (
    <>
      <Card elevation={8} sx={{ maxWidth: 345, height: "100%" }}>
        <CardContent>
          <Typography gutterBottom component="div">
            {props.pd.Nombre ||
              props.pd.Nombre_Material ||
              props.pd.Modelo ||
              props.pd.Proceso}
          </Typography>
          <Typography variant="body2"></Typography>
        </CardContent>
        <CardActions>
          <ButtonGroup>
            <Button
              size="small"
              variant="text"
              color="info"
              //onClick={() => editClickHandler(props.id)}
              onClick={() => {navigate(`/hamlet/${props.collection}/edit/${props.id}`)}}
            >
              Editar
            </Button>
            <Button
              size="small"
              variant="text"
              color="success"
              //onClick={() => copyClickHandler(props.id)}
              onClick={() => {navigate(`/hamlet/${props.collection}/copy/${props.id}`)}}
            >
              Copiar
            </Button>
            <Button
              size="small"
              variant="text"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteClickHandler(props.id)}
            >
              Eliminar
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>
    </>
  );

  return useView === "viewer" ? viewer : editor;
};

export default ItemsDetails;
