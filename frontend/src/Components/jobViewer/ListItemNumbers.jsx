import React from "react";
import { Box, ListItemText } from "@mui/material";

const ListItemNumbers = (props) => {
  return (
    <Box
      alignItems="flex-start"
      sx={{ width: "100%", padding: "5px 0 10px 0px" }}
    >
      <ListItemText
        primary={props.primary}
        secondary={props.secondary}
        secondaryTypographyProps={{
          variant: "body1",
          fontSize: 12,
          align: "right",
        }}
        primaryTypographyProps={{
          variant: "h3",
          fontSize: 16,
          align: "right",
        }}
      />
    </Box>
  );
};

export default ListItemNumbers;
