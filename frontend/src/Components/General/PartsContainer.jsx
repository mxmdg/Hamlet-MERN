import Form from "../Formulario/Form";
import FormDataForm from "../Formulario/FormatDataForm";
import FetchParts from "./FetchParts";

//import "../../Styles/hamlet.css";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PartsContainer = (props) => {
  return (
    <Container>
      <FetchParts collection={props.entity} subdir="partes"/>
    </Container>
  );
};

export default PartsContainer;
