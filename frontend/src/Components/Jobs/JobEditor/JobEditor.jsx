import React from "react";

import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Spinner from "../../General/Spinner";
import JobsForm from "../JobsForm";

//MUI Material Imports

import {
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Paper,
} from "@mui/material";

const JobEditor = (props) => {
  /*
        Componente para generar nuevos trabajos y editar los existetntes.

        Props que recibe:
        - props.job 
        Trabajo a editar, si no lo recibe, es un trabajo nuevo y los formularios deben estar vacios.
        De lo contrario debe mostra el formulario completado con los valores correspondientes al trabajo.

        Estados:
        - useLoadin
        Cargando datos, en principio desactivado, los datos no deberian tardar en cargarse en este componente.


    */

  const [useError, setError] = React.useState(null);
  const [useLoading, setLoading] = React.useState(false);

  const [useJob, setJob] = React.useState(props.job || null);

  const showError = (
    <ErrorMessage message={useError} action={() => setError(null)} />
  );
  const showLoading = <Spinner />;
  const success = (
    <Container>
      <Grid container columns={12}>
        <Grid columns={4}>
          <Paper elevation={16} square>
            <Card>
              <CardHeader
                title={props.job?.Nombre || "Nuevo Trabajo"}
                subheader={props.job?.Cantidad || ""}
              />
            </Card>
            <CardContent>
              <JobsForm data={props.job ? props.job : null} />
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  return useLoading ? showLoading : useError !== null ? showError : success;
};

export default JobEditor;
