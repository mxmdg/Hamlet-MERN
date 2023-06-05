import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "@mui/material";

export default function CircularColor() {
  return (
    <Container>
      <CircularProgress color="secondary" />
    </Container>
  );
}
