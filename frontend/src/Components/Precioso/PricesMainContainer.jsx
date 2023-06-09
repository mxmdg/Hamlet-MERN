import Precioso from "./Precioso";
import Form from "../Formulario/Form";
import PricesDataForm from "../Formulario/PricesDataForm";
//import "../../Styles/hamlet.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useState } from 'react';

const PricesMainContainer = () => {
  const [ useNewPrice , setNewPrice ] = useState(false)

  return (
    <Container>
      <Box>
        <h3>Costos</h3>
        <Precioso collection="precios" priceState={useNewPrice} />
        <Form form={PricesDataForm} collection="precios" setState={setNewPrice} task="new"/>
      </Box>
    </Container>
  );
};

export default PricesMainContainer;
