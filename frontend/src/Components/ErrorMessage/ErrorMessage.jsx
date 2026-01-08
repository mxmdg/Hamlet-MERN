import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Grid, Tooltip } from "@mui/material";
import { ReactComponent as Logo2 } from "../../../src/img/Logo/logo ok-01.svg";

// ErrorMessage component displays an error alert or dialog based on props
const ErrorMessage = (props) => {
  // moved hook here so it's always called on every render
  const [open, setOpen] = useState(true);

  // normalizeError: returns a string or null (if no error)
  const normalizeError = (err) => {
    try {
      if (err === null || err === undefined || err === false) return null;
      // Accept explicit error prop or message prop or children
      // Strings
      if (typeof err === "string") return err;
      // Error instances
      if (err instanceof Error) return err.message || String(err);
      // AxiosError-like objects
      if (typeof err === "object") {
        // axios: err.response?.data?.message or err.message
        if (err.response && err.response.data) {
          const respData = err.response.data;
          if (typeof respData === "string") return respData;
          if (respData && typeof respData.message === "string")
            return respData.message;
        }
        if (err.isAxiosError && typeof err.message === "string")
          return err.message;
        // Generic object with message prop
        if (typeof err.message === "string") return err.message;
        // If object has toString that isn't [object Object], use it
        if (typeof err.toString === "function") {
          const s = err.toString();
          if (typeof s === "string" && s !== "[object Object]") return s;
        }
      }
      // Fallback
      return "Ocurrió un error inesperado";
    } catch (e) {
      // Nunca lanzar desde aquí
      return "Ocurrió un error inesperado";
    }
  };

  // Determine raw input (support props.error, props.message, props.children)
  const raw = props.error ?? props.message ?? props.children;
  const message = normalizeError(raw);

  // Si no hay mensaje válido, no renderizar nada
  if (!message) return null;

  const handleClose = () => {
    setOpen(false);
  };

  // Closes the dialog and triggers a delete/close action from parent
  const handleCloseAndDelete = () => {
    try {
      if (props.action) props.action();
    } catch (e) {
      // ignorar errores en callbacks del parent
    }
    setOpen(false);
  };

  // Optional action button for the alert, triggers props.action if provided
  const actionButton = (
    <Tooltip title={props.tooltip || "Cerrar"}>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        onClick={() => (props.action ? props.action() : null)}
      >
        {props.buttonTxt || "Ok"}
      </Button>
    </Tooltip>
  );

  const alert = (
    <Alert
      variant={props.variant || "filled"}
      severity={props.severity || "error"}
      action={props.action ? actionButton : null}
    >
      <Typography component="span" variant="body2">
        {message}
      </Typography>
    </Alert>
  );

  const dialogError = (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, p: 2 }}
        id="customized-dialog-title"
        color={props.severity || "primary"}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item sx={{ margin: "auto" }}>
            <Typography variant="h5">{props.title}</Typography>
          </Grid>
          <Grid
            item
            alignSelf={"flex-end"}
            sx={{ marginLeft: "auto", marginTop: 0 }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              color={props.severity || "primary"}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color={props.severity || "primary"}
          onClick={handleCloseAndDelete}
        >
          {props.buttonTxt || "ok"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Si se proporciona title, usar dialog; si no, usar alert
  return props.title ? dialogError : alert;
};

export default ErrorMessage;
