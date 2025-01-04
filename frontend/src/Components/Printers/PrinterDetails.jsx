import "./printers.css";
import Cmyk from "./Cmyk";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../Config/config";
import { useNavigate } from "react-router-dom";

import { NewSimpleLineChart } from "../utils/stats/NewSimpleLineChart";
import FormMaterial from "../Formulario/FormMaterial";
import PrintersDataForm from "../Formulario/PrintersDataForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NewStackedBarChart from "../utils/stats/NewStackedBarChart";
import {
  getMyDate,
  getWeekNumber,
  handleDate,
  procesarFechaISO,
} from "../utils/generalData/fechaDiccionario";

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
  const navigate = useNavigate();

  const editClickHandler = (e) => {
    navigate(`../impresoras/edit/${props.pd._id}`);
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

  let currentData = props.pd.Billing;

  currentData.map((B) => {
    B.mmyy = procesarFechaISO(B.Fecha);
  });

  const Show = () => {
    try {
      return (
        <>
          <CardHeader
            title={props.pd.Modelo}
            subheader={props.pd.Fabricante}
          >{`Colores: ${props.pd.Colores}`}</CardHeader>
          <CardContent>
            <Cmyk colores={props.pd.Colores} />
            <Grid container columns={12}>
              <Grid item columns={6}>
                <List>
                  <ListItem divider={true}>
                    <ListItemText primary="Contadores" />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Total:"
                      secondary={props.pd.TotalPrints || 0}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Color:"
                      secondary={props.pd.ColorPrints || 0}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Blanco y negro:"
                      secondary={props.pd.BlackPrints || 0}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Grandes:"
                      secondary={props.pd.LargePrints || 0}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Chicas:"
                      secondary={props.pd.SmallPrints || 0}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Divider orientation="vertical" />
              <Grid item columns={6}>
                <List>
                  <ListItem divider={true}>
                    <ListItemText primary="Ultimo Mes" />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Total:"
                      secondary={
                        props.pd.Billing[props.pd.Billing.length - 1].Total || 0
                      }
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Color:"
                      secondary={
                        props.pd.Billing[props.pd.Billing.length - 1].Color || 0
                      }
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Blanco y negro:"
                      secondary={
                        props.pd.Billing[props.pd.Billing.length - 1].Black || 0
                      }
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Grandes:"
                      secondary={
                        props.pd.Billing[props.pd.Billing.length - 1].Large || 0
                      }
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Chicas:"
                      secondary={
                        props.pd.Billing[props.pd.Billing.length - 1].Small || 0
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Box>
              <NewSimpleLineChart
                dataKey={["mmyy", "Black", "Color", "Large", "Small", "Total"]}
                data={currentData}
              />
            </Box>
          </CardContent>
          <CardActions>
            <ButtonGroup>
              <Button
                color="primary"
                onClick={(e) => editClickHandler(props.pd._id)}
              >
                Editar
              </Button>
              <Button
                color="error"
                onClick={(e) => deleteClickHandler(props.pd._id)}
              >
                Eliminar
              </Button>
            </ButtonGroup>
          </CardActions>
        </>
      );
    } catch (error) {
      return (
        <ErrorMessage
          message={
            "No se encuentra información sobre los contadores de la impresora"
          }
          severity="warning"
          action={() => navigate(`../impresoras/edit/${props.pd._id}`)}
        />
      );
    }
  };

  const Edit = (
    <FormMaterial
      id={props.pd._id}
      form={PrintersDataForm}
      collection="impresoras"
      task="edit"
    />
  );

  const deprecatiedEdit = (
    <div id={props.pd._id} className="frame">
      <div className="frame__title">
        <input type="text" defaultValue={props.pd.Modelo}></input>{" "}
        <input type="text" defaultValue={props.pd.Fabricante}></input>
      </div>
      <input
        type="number"
        placeholder="Colores"
        defaultValue={props.pd.Colores}
        aria-label="Colores"
      ></input>
      <input
        type="number"
        placeholder="Paginas por minuto"
        defaultValue={props.pd.Paginas_por_minuto}
      ></input>
      <input
        type="number"
        placeholder="Ancho Minimo"
        defaultValue={props.pd.X_Minimo}
      ></input>{" "}
      -{" "}
      <input
        type="number"
        placeholder="Ancho Maximo"
        defaultValue={props.pd.X_Maximo}
      ></input>
      <input
        type="number"
        placeholder="Alto Minimo"
        defaultValue={props.pd.Y_Minimo}
      ></input>{" "}
      -{" "}
      <input
        type="number"
        placeholder="Alto Maximo"
        defaultValue={props.pd.Y_Maximo}
      ></input>
      <button onClick={saveClickHandler}>Guardar</button>
      <button onClick={cancelClickHandler}>Cancelar</button>
    </div>
  );

  const error = (
    <ErrorMessage
      message={"No hay informacion"}
      action={() => navigate(`impresoras`)}
    />
  );

  const [state, setState] = useState(currentData !== undefined ? Show : error);

  return state;
};

export default PrinterDetails;
