import Formats from "./Formats";
import Form from "../Formulario/Form";
import FormDataForm from "../Formulario/FormatDataForm";
//import "../../Styles/hamlet.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from 'react';

const FormatsMainContainer = () => {
  const [ formatState , setFormatState ] = useState()

  return (
    <Container>
      <Box>
        <Typography
          gutterBottom
          variant="h6"
          color="secondary"
          fontWeight={600}
          component="div"
        >
          Formatos
        </Typography>
        <Formats collection="formatos" formatState={formatState}/>
        <Form form={FormDataForm} collection="formatos" setState={setFormatState} task="new"/>
      </Box>
    </Container>
  );
};

export default FormatsMainContainer;
