import Printers from "./Printers";
import Form from "../Formulario/Form";
import PrintersDataForm from "../Formulario/PrintersDataForm";
import React, { useState } from "react";
import Container from "@mui/material/Container";
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
import AddFloatButton from "../General/AddFloatButton";

const PrintersMainContainer = () => {
  const collection = "impresoras";
  const navigate = useNavigate();

  return (
    <Container>
        <Printers collection={collection} />
      </Container>
  );
};

export default PrintersMainContainer;
