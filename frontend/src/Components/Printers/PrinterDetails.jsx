import "./printers.css";
import Cmyk from "./Cmyk";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../Config/config";

import {
  Avatar,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Modal,
  Divider,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Select,
  ButtonGroup,
} from "@mui/material";

const PrinterDetails = (props) => {
  const editClickHandler = (e) => {
    setState(Edit);
  };

  const saveClickHandler = (e) => {
    e.preventDefault();
    setState(Show);
  };

  const cancelClickHandler = () => {
    setState(Show);
  };

  const deleteClickHandler = async (id) => {
    if (window.confirm("Estas recontra seguro de borrar esta impresora?")) {
      try {
        await axios.delete(`${serverURL}/hamlet/impresoras/${id}`);
      } catch (e) {
        alert(e);
      }
    }
  };

  const Show = (
    <>
      <CardHeader title={props.pd.Modelo} subheader={props.pd.Fabricante}>
      </CardHeader>
      <CardContent>
        <Cmyk colores={props.pd.Colores} />
        <List subheader={`Colores: ${props.pd.Colores}`}>
          
          <ListItem divider={true}>
            <ListItemText primary='Contadores' />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText primary='Total:' secondary={props.pd.TotalPrints} />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText primary='Color:' secondary={props.pd.ColorPrints} />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText primary='Blanco y negro:' secondary={props.pd.BlackPrints} />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText primary='Grandes:' secondary={props.pd.LargePrints} />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText primary='Chicas:' secondary={props.pd.SmallPrints} />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <ButtonGroup>
          <Button color='primary' onClick={(e) => editClickHandler(props.pd._id)}>Editar</Button>
          <Button color='error' onClick={(e) => deleteClickHandler(props.pd._id)}>Eliminar</Button>
        </ButtonGroup>
      </CardActions>
    </>
  );

  const Edit = (
    <div id={props.pd._id} className="frame">
      <div className="frame__title">
        <input type="text" defaultValue={props.pd.Modelo}></input>{" "}
        <input type="text" defaultValue={props.pd.Fabricante}></input>
      </div>
      <input type="number" placeholder="Colores" defaultValue={props.pd.Colores} aria-label="Colores"></input>
      <input type="number" placeholder="Paginas por minuto" defaultValue={props.pd.Paginas_por_minuto}></input>
      <input type="number" placeholder="Ancho Minimo" defaultValue={props.pd.X_Minimo}></input> -{" "}
      <input type="number" placeholder="Ancho Maximo" defaultValue={props.pd.X_Maximo}></input>
      <input type="number" placeholder="Alto Minimo" defaultValue={props.pd.Y_Minimo}></input> -{" "}
      <input type="number" placeholder="Alto Maximo" defaultValue={props.pd.Y_Maximo}></input>
      <button onClick={saveClickHandler}>Guardar</button>
      <button onClick={cancelClickHandler}>Cancelar</button>
    </div>
  );

  const [state, setState] = useState(Show);

  return state;
};

export default PrinterDetails;
