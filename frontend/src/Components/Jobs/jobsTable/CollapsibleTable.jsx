import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { fechtData, getPrivateElements } from "../../customHooks/FetchDataHook";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Spinner from "../../General/Spinner";

function createData(
  name,
  product,
  quantity,
  customer,
  owner,
  emited,
  deadLine,
  parts
) {
  const arr = [];
  parts.map((p) => {
    const data = {
      type: p.jobParts[0].Type,
      name: p.Name,
      pages: p.Pages,
      size: `${p.Ancho} x ${p.Alto} mm`,
      colors: `${p.ColoresFrente} / ${p.ColoresDorso || "0"}`,
      stock: `${p.partStock.Marca} ${p.partStock.Tipo} ${p.partStock.Gramaje}`,
    };
    arr.push(data);
  });

  console.log(arr);

  return {
    name,
    product,
    quantity,
    customer,
    owner,
    emited,
    deadLine,
    Partes: arr,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.product}</TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
        <TableCell align="right">{row.customer}</TableCell>
        <TableCell align="right">{row.owner}</TableCell>
        <TableCell align="right">{row.emited}</TableCell>
        <TableCell align="right">{row.deadLine}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Partes
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Páginas</TableCell>
                    <TableCell align="right">Formato</TableCell>
                    <TableCell align="right">Colores</TableCell>
                    <TableCell align="left">Material</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Partes?.map((historyRow) => (
                    <TableRow key={historyRow._id}>
                      <TableCell component="th" scope="row">
                        {historyRow.type}
                      </TableCell>
                      <TableCell>{historyRow.name}</TableCell>
                      <TableCell align="right">{historyRow.pages}</TableCell>
                      <TableCell align="right">{historyRow.size}</TableCell>
                      <TableCell align="right">{historyRow.colors}</TableCell>
                      <TableCell align="left">{historyRow.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

/* Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
}; */

const rows = [];

export default function CollapsibleTable() {
  const [useLoading, setLoading] = React.useState(true);
  const [useError, setError] = React.useState(null);
  const [data, setData] = React.useState(rows);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getPrivateElements("jobs/complete");
        setLoading(false);
        const data = res.map((job) => {
          return createData(
            job.Nombre,
            job.Tipo[0].name,
            job.Cantidad,
            job.Company.Nombre,
            job.Owner?.Name + job.Owner?.LastName,
            job.Emision,
            job.DeadLine,
            job.Partes
          );
        });
        rows.push(...data); // Use spread operator to push elements individually
        setData([...data]); // Update state with the fetched data
      } catch (error) {
        setError(error);
      }
    };

    loadData();
  }, []);

  const tableOK = (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Pedido</TableCell>
            <TableCell align="right">Nombre</TableCell>
            <TableCell align="right">Tipo</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Cliente</TableCell>
            <TableCell align="right">Representante</TableCell>
            <TableCell align="right">Emision</TableCell>
            <TableCell align="right">Entrega</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const alert = <ErrorMessage message={useError?.message} severity="warning" />;

  const spinner = <Spinner />;

  return useLoading ? spinner : useError !== null ? alert : tableOK;
}
