import Formats from "./Formats";
import Form from "../Formulario/Form";
import FormDataForm from "../Formulario/FormatDataForm";
import "../../Styles/hamlet.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const FormatsMainContainer = () => {
  return (
    <Container>
      <Box>
        <Typography
          gutterBottom
          variant="h4"
          color="#e6f"
          fontWeight={600}
          component="div"
        >
          Formatos
        </Typography>
        <Formats collection="formatos" />
        <Form form={FormDataForm} collection="formatos" />
      </Box>
    </Container>
  );
};

export default FormatsMainContainer;
