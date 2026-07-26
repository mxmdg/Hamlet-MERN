import Fetch from "../General/Fetch";
import { Container } from "@mui/material";

const MainContainer = (props) => {
  return (
    <Container sx={{ width: "100vw" }}>
      <Fetch
        form={props.form}
        collection={props.entity}
        {...(props.queryName !== undefined
          ? { queryName: props.queryName, queryParams: props.queryParams }
          : {})}
      />
    </Container>
  );
};

export default MainContainer;
