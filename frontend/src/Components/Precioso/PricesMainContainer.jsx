import Precioso from "./Precioso";
import Form from "../Formulario/Form";
import PricesDataForm from "../Formulario/PricesDataForm";
//import "../../Styles/hamlet.css";
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
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PricesMainContainer = () => {
  const [useNewPrice, setNewPrice] = useState(false);
  const navigate = useNavigate();
  const collection = "precios";
  const [loading, setLoading] = useState(true);

  return (
    <Container fluid>
      <Card variant="elevation" elevation={10} raised m={10} sx={{ p: "25px" }}>
        <CardHeader title={collection} />
        <CardContent>
          <Precioso collection="precios" priceState={useNewPrice} />
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            color="info"
            onClick={() => navigate(`/hamlet/precios/add`)}
          >
            Agregar Precios
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default PricesMainContainer;
