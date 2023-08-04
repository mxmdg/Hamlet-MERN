import Formats from "./Formats";
import Form from "../Formulario/Form";
import FormDataForm from "../Formulario/FormatDataForm";
//import "../../Styles/hamlet.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useState } from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FormatsMainContainer = () => {
  const collection = "formatos";
  const navigate = useNavigate();

  return (
    <Container>
      <Card variant="elevation" elevation={10} raised m={10} sx={{ p: "25px" }}>
        <CardHeader title={collection} />
        <CardContent>
          <Formats collection={collection} />
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            size="small"
            color="info"
            onClick={() => navigate(`/hamlet/${collection}/add`)}
          >
            Agregar {collection}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default FormatsMainContainer;
