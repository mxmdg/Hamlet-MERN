import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(Cantidad, Pliego, Unitario, Total) {
  return { Cantidad, Pliego, Unitario, Total };
}

export default function SimulationTable(props) {
  const rows = () => {
    let result = [];
    for (let q of props.cantidades) {
      for (let p of props.pliegos) {
        result.push(
          createData(
            q,
            p,
            props.simCLC(props.data, q, p).Unitario,
            props.simCLC(props.data, q, p).Total
          )
        );
      }
    }
    return result;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Camtidad</TableCell>
            <TableCell align="right">Pliego</TableCell>
            <TableCell align="right">Unitario</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows().map((row) => (
            <TableRow
              key={row.Cantidad}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.Cantidad}
              </TableCell>
              <TableCell align="right">
                {row.Pliego.Ancho} x {row.Pliego.Alto}
              </TableCell>
              <TableCell align="right">{row.Unitario}</TableCell>
              <TableCell align="right">{row.Total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
