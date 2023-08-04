import * as React from "react";
import Stack from "@mui/material/Stack";
import { Container, CircularProgress, LinearProgress } from "@mui/material";

export default function Spinner(props) {
  return (
    <Container>
      <LinearProgress color={props.color} />
    </Container>
  );
}
