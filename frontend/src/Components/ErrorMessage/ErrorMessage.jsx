import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorMessage = (props) => {
  const navigate = useNavigate();

  const actionButton = (
    <Button
      variant="outlined"
      color="inherit"
      size="small"
      onClick={() => props.action()}
    >
      OK
    </Button>
  );

  const alert = (
    <Alert
      variant="filled"
      severity={props.severity || "error"}
      action={props.action ? actionButton : ""}
    >
      {props.message}
    </Alert>
  );
  return alert;
};

export default ErrorMessage;
