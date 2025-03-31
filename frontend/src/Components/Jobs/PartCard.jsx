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
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { calcularLomo } from "../jobViewer/JobDetail";
import arrayNormalizer from "../utils/generalData/arrayNormalizer";
import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import DialogModal from "./DialogModal";
import UploadFilesButton from "../utils/ReusableComponents/UploadFilesButton";
import { handleUploadSuccess } from "../utils/ReusableComponents/UploadFilesButton";

const DeletePartMessage = "Estas seguro de eliminar esta parte?";

const PartCard = (props) => {
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

  const StyledCard = styled(Paper)(({ theme }) => ({
    marginTop: "20px",
    background: theme.palette.background.dark,
    height: "100%",
    display: "flex",
    flexFlow: "column",
    alignContent: "space-between",
    border: "1px solid",
    borderColor: theme.palette.primary.main,
  }));

  React.useEffect(() => {
    const Finishing = arrayNormalizer(props.part.Finishing, getFinishers);
    setFinishers(Finishing);
    setLoading(false);
  }, [props.part, props.part.Finishing]);

  const alert = (
    <ErrorMessage message={useError.message} action={() => setError(false)} />
  );
  const loading = <Spinner color="info" />;

  if (useLoading) return <Spinner />;
  if (useError) return <ErrorMessage message={useError} />;

  return (
    <StyledCard variant="elevation" square={true} elevation={10}>
      <CardHeader
        title={props.part.Name}
        subheader={`${props.part.jobParts[0]?.Type}`}
      ></CardHeader>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2">
          Paginas: {props.part.Pages}
          <br />
          Formato: {props.part.Ancho} x {props.part.Alto}
          <br />
          Impresion: {props.part.ColoresFrente}/{props.part.ColoresDorso}
          <br />
          Material: {props.part.partStock.Nombre_Material}
          {props.part.Pages > 10 ? (
            <>
              {` (Lomo: ${calcularLomo(
                props.part.Pages,
                props.part.partStock.Espesor_Resma
              )} mm.)`}
            </>
          ) : (
            ""
          )}
          <br />
          <UploadFilesButton
            uploadUrl="http://192.168.1.46:8000/upload"
            onUploadSuccess={handleUploadSuccess}
            expectedPageCount={props.part.Pages}
            expectedSize={`${props.part.Ancho}x${props.part.Alto}`}
          />
          <br />
        </Typography>
        {Array.isArray(useFinishers) && useFinishers.length > 0 && (
          <Fragment>
            <Divider />
            <List dense disablePadding>
              {useFinishers.map((f) => {
                return (
                  <ListItem disableGutters key={`${f._id}${props.part._id}`}>
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
        <ButtonGroup size="small" variant="contained">
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
          {
            /* 
          
            Agregar Boton para copiar partes, antes hay que resolver la 
            propiedad _id para que se modifique, porque nos da error la repeticion de ids*/

            <Button
              color="secondary"
              onClick={(e) => {
                e.preventDefault();
                const copiedPart = { ...props.part };
                delete copiedPart._id;
                console.log("ID Job Part: " + copiedPart.jobParts[0]._id);
                copiedPart.jobParts.push(props.part.jobParts[0]._id);
                props.copyPart(copiedPart);
                props.setActiveStep(2);
              }}
            >
              Copiar
            </Button>
          }

          <DialogModal
            title={`Eliminar ${props.part.Name}`}
            color="warning"
            message={DeletePartMessage}
            closeAction={props.removePart}
            index={props.index}
            btnTxt="Eliminar"
            OkBtnTxt="Si"
            CancelBtnTxt="No"
          />
        </ButtonGroup>
      </CardActions>
    </StyledCard>
  );
};

export default PartCard;
