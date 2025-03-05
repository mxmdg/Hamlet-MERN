import React from "react";
import { ListItem, ListItemText } from "@mui/material";

const ListItemNumbers = (props) => {
  return (
    <ListItem alignItems="flex-start">
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
    </ListItem>
  );
};

export default ListItemNumbers;
