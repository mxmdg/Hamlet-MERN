import * as React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

export default function IconChips(props) {
  return (
    <Stack direction="row" spacing={1}>
      <Chip
        label={props.label}
        color="secondary"
        variant="contained"
        onClick={props.onClick}
        icon={<IntegrationInstructionsIcon />}
      />
    </Stack>
  );
}
