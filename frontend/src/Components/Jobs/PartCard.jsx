import React, { Fragment } from "react";

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
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { calcularLomo } from "../jobViewer/JobDetail";
import arrayNormalizer from "../utils/generalData/arrayNormalizer";
import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

const PartCard = (props) => {
  const [part, setPart] = React.useState(props.part);
  const [index, setIndex] = React.useState(props.index);
  const [useFinishers, setFinishers] = React.useState([]);
  const [useLoading, setLoading] = React.useState(false);
  const [useError, setError] = React.useState(false);

  const getFinishers = (ids) => {
    const arr = [];
    try {
      setLoading(true);
      ids.map(async (id) => {
        const res = await getPrivateElementByID("finishers", id);
        arr.push(res.data);
      });
      setLoading(false);
      return arr;
    } catch (error) {
      setError(error);
      return error;
    }
  };

  React.useEffect(() => {
    const Finishing = arrayNormalizer(part.Finishing, getFinishers);
    setFinishers(Finishing);
    setLoading(false);
  }, []);

  const success = (
    <Card
      variant="outlined"
      sx={{
        marginTop: "20px",
        border: "1px solid #666",
        background: "transparent",
        height: "100%",
        display: "flex",
        flexFlow: "column",
        alignContent: "space-between",
      }}
    >
      <CardHeader
        title={part.Name}
        subheader={part.jobParts[0]?.Type}
      ></CardHeader>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2">
          Paginas: {part.Pages}
          <br />
          Formato: {part.Ancho} x {part.Alto}
          <br />
          Impresion: {part.ColoresFrente}/{part.ColoresDorso}
          <br />
          Material: {part.partStock.Nombre_Material}
          {part.Pages > 10 ? (
            <>
              {` (Lomo: ${calcularLomo(
                part.Pages,
                part.partStock.Espesor_Resma
              )} mm.)`}
            </>
          ) : (
            ""
          )}
          <br />
          <br />
        </Typography>
        {Array.isArray(useFinishers) && useFinishers.length > 0 && (
          <Fragment>
            <Divider />
            <List dense disablePadding>
              {useFinishers.map((f) => {
                return (
                  <ListItem disableGutters key={`${f._id}${part._id}`}>
                    <ListItemText
                      primary={`Proceso: ${f.Proceso}`}
                      secondary={`Modelo ${f.Modelo}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Fragment>
        )}
      </CardContent>
      <CardActions>
        <ButtonGroup size="small" variant="text">
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
  const alert = (
    <ErrorMessage message={useError.message} action={() => setError(false)} />
  );
  const loading = <Spinner color="info" />;

  return useLoading ? loading : useError ? alert : success;
};

export default PartCard;
