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
import { spanishFormat } from "../utils/generalData/numbersAndCurrencies";
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
import Grid from "@mui/material/Unstable_Grid2";

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

  const titleType = { color: "primary.text", variant: "title", align: "right" };
  const subtitleType = {
    color: "danger.main",
    variant: "h5",
    align: "right",
  };

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
            <Grid container columns={12} spacing={1} divider={true}>
              <Grid item columns={12} sx={{ width: "49%" }}>
                <List>
                  <ListItem divider={true}>
                    <ListItemText primary="Contadores" />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Total:"
                      secondary={spanishFormat(props.pd.TotalPrints) || 0}
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Color:"
                      secondary={spanishFormat(props.pd.ColorPrints) || 0}
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Blanco y negro:"
                      secondary={spanishFormat(props.pd.BlackPrints) || 0}
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Grandes:"
                      secondary={spanishFormat(props.pd.LargePrints) || 0}
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Chicas:"
                      secondary={spanishFormat(props.pd.SmallPrints) || 0}
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Divider />
              <Grid item columns={6} sx={{ width: "49%" }}>
                <List>
                  <ListItem divider={true}>
                    <ListItemText primary="Ultimo Mes" />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Total:"
                      secondary={
                        spanishFormat(
                          props.pd.Billing[props.pd.Billing.length - 1].Total
                        ) || 0
                      }
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Color:"
                      secondary={
                        spanishFormat(
                          props.pd.Billing[props.pd.Billing.length - 1].Color
                        ) || 0
                      }
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Blanco y negro:"
                      secondary={
                        spanishFormat(
                          props.pd.Billing[props.pd.Billing.length - 1].Black
                        ) || 0
                      }
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Grandes:"
                      secondary={
                        spanishFormat(
                          props.pd.Billing[props.pd.Billing.length - 1].Large
                        ) || 0
                      }
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemText
                      primary="Chicas:"
                      secondary={
                        spanishFormat(
                          props.pd.Billing[props.pd.Billing.length - 1].Small
                        ) || 0
                      }
                      primaryTypographyProps={titleType}
                      secondaryTypographyProps={subtitleType}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Container sx={{ width: "100%", height: "100%" }}>
              <Typography variant="subtitle2">Impresiones por mes</Typography>
              <NewSimpleLineChart
                dataKey={["mmyy", "Black", "Color", "Large", "Small", "Total"]}
                data={currentData}
              />
            </Container>
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
          message={`No se registran contadores para ${props.pd.Fabricante} ${props.pd.Modelo} `}
          severity="info"
          action={() => navigate(`..//impresoras/edit/${props.pd._id}`)}
          buttonTxt="Ver detalle"
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
