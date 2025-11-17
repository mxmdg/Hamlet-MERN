import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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
  // State to control dialog open/close
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Closes the dialog and triggers a delete/close action from parent

  const handleCloseAndDelete = () => {
    if (props.action) {
      props.action();
    }
    setOpen(false);
  };

  //const navigate = useNavigate();

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
      action={props.action ? actionButton : ""}
    >
      {props.message}
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
              variant="contained"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>{props.message}</Typography>
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

  return props.title ? dialogError : alert;
};

export default ErrorMessage;
