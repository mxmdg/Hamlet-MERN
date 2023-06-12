import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconChips from "./Chip";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "1px solid #839",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button
        variant="text"
        size="small"
        color="secondary"
        sx={{ textAlign: "left" }}
        label={props.btnText}
        onClick={handleOpen}
        value={props.btnText}
      >
        Ver Formula
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper elevation={12} sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color="success"
          >
            {props.modalTitle}
          </Typography>
          <Typography id="modal-modal-description" color="info" sx={{ mt: 2 }}>
            {props.modalText}
          </Typography>
        </Paper>
      </Modal>
    </Box>
  );
}
