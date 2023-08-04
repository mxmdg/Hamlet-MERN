import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconChips from "./Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import LastSeen from "./LastUpdate";
import MyLineChart from "./LineChart";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "96vw",
  border: "1px solid #839",
  boxShadow: 24,
  p: 4,
};

export default function Historial(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.stateHistory(false);
  };

  const handleDate = (date) => {
    const fecha = new Date(date);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = fecha.toLocaleDateString("es-ES", options);
    return formattedDate;
  };

  React.useEffect(() => {}, [open]);

  const tableHead = ((data) => {
    try {
      return Object.getOwnPropertyNames(data[data.length - 1]);
    } catch (e) {
      console.log(e);
      return ["Error", "No hay datos en el historial", e];
    }
  })(props.data);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
            variant="h5"
            component="h4"
            color="info"
          >
            Historial!
          </Typography>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {tableHead.slice(0, -1).map((title, index) => (
                    <TableCell align="left" key={title + index}>
                      {title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
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
                        {handleDate(row.Fecha)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={props.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <MyLineChart data={props.data} />
        </Paper>
      </Modal>
    </div>
  );
}
