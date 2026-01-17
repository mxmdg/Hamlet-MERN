import "../../Styles/hamlet.css";
import axios from "axios";
import { HAMLET_API } from "../Config/config";
import Form from "../Formulario/Form";
import { useState, useEffect } from "react";
//import { DataGrid } from '@mui/x-data-grid';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { StyledTooltip, DangerTooltip } from "./TableGrid";

const ItemsDetails = (props) => {
  const [useView, setView] = useState("viewer");
  const [useItemToEdit, setItemToEdit] = useState({});
  const [useTask, setTask] = useState("new");
  const navigate = useNavigate();
  const getElements = async () => {
    const items = await axios.get(`${HAMLET_API}/${props.collection}/`);
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
        await axios.delete(`${HAMLET_API}/${props.collection}/${id}`);
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
        `${HAMLET_API}/${props.collection}/${id}`
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
        `${HAMLET_API}/${props.collection}/${id}`
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
        <Divider variant="middle" light={true} />
        <CardActions>
          <ButtonGroup>
            <StyledTooltip title="Copiar" arrow>
              <IconButton
                onClick={() => {
                  navigate(`/hamlet/${props.collection}/copy/${props.id}`);
                }}
                sx={{ alignSelf: "right" }}
              >
                <ContentCopyIcon />
              </IconButton>
            </StyledTooltip>
            <StyledTooltip title="Editar" arrow>
              <IconButton
                onClick={() => {
                  navigate(`/hamlet/${props.collection}/edit/${props.id}`);
                }}
                sx={{ alignSelf: "right" }}
              >
                <EditIcon />
              </IconButton>
            </StyledTooltip>
            <DangerTooltip title="¡BORRAR!" arrow>
              <IconButton
                sx={{ alignSelf: "right" }}
                onClick={() => deleteClickHandler(props.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </DangerTooltip>
            {/* <Button
              size="small"
              variant="text"
              color="info"
              //onClick={() => editClickHandler(props.id)}
              onClick={() => {
                navigate(`/hamlet/${props.collection}/edit/${props.id}`);
              }}
            >
              Editar
            </Button>
            <Button
              size="small"
              variant="text"
              color="success"
              //onClick={() => copyClickHandler(props.id)}
              onClick={() => {
                navigate(`/hamlet/${props.collection}/copy/${props.id}`);
              }}
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
            </Button> */}
          </ButtonGroup>
        </CardActions>
      </Card>
    </>
  );

  return useView === "viewer" ? viewer : editor;
};

export default ItemsDetails;
