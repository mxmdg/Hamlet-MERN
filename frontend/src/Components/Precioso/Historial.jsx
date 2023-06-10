import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconChips from "./Chip";
import { LineChart, Line } from "recharts";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LastSeen from "./LastUpdate";

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

export default function Historial(props) {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {}, [open]);

  const tableHead = props.data
    ? Object.getOwnPropertyNames(props.data[props.data.length - 1])
    : ["No", "Hay", "Elementos"];

  return (
    <div>
      {/* <IconChips
        variant="contained"
        size="small"
        color="success"
        label={props.btnText}
        onClick={handleOpen}
      /> */}
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
            color="secondary"
          >
            Historial!
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {tableHead.slice(0, -1).map((title) => (
                    <TableCell align="left" key={title}>
                      {title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.data.map((row) => (
                  <TableRow>
                    <TableCell component="th" scope="row" align="left">
                      {row.Valor}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.Entrada}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.Minimo}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.Fecha}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Modal>
    </div>
  );
}
