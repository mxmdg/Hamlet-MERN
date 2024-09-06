import React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import {
  Divider,
  Chip,
  Stack,
  Button,
  Container,
  ButtonGroup,
  Grid,
} from "@mui/material";

import { calcularLomo } from "../jobViewer/JobDetail";

const PartCard = (props) => {
  const [part, setPart] = React.useState(props.part);
  const [index, setIndex] = React.useState(props.index);

  return (
    <Card
      variant="elevation"
      elevation={12}
      square={true}
      sx={{ marginTop: "20px" }}
    >
      <CardHeader
        title={part.Name}
        subheader={part.jobParts[0]?.Type}
      ></CardHeader>
      <CardContent>
        Paginas: {part.Pages}
        <br />
        Formato: {part.Ancho} x {part.Alto}
        <br />
        Impresion: {part.ColoresFrente}/{part.ColoresDorso}
        <br />
        Material: {part.partStock.Nombre_Material}
        <br />
        {part.Pages > 10 ? (
          <>
            Lomo: {calcularLomo(part.Pages, part.partStock.Espesor_Resma)} mm.
          </>
        ) : (
          ""
        )}
      </CardContent>
      <CardActions>
        <ButtonGroup size="small">
          <Button
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              props.editPart(index);
              props.setActiveStep(1);
            }}
          >
            Editar
          </Button>
          {/* 
          
            Agregar Boton para copiar partes, antes hay que resolver la 
            propiedad _id para que se modifique, porque nos da error la repeticion de ids

          <Button
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              props.addPart(props.part);
              props.setActiveStep(1);
            }}
          >
            Copiar
          </Button> */}
          <Button
            color="error"
            onClick={() => {
              props.removePart(index);
            }}
          >
            Eliminar
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default PartCard;
