import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";

const ErrorMessage = (props) => {
  const alert = (
    <Alert variant="filled" severity={props.severity || "error"}>
      {props.message}
    </Alert>
  );
  return alert;
};

export default ErrorMessage;
