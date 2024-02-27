import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { fechtData, getPrivateElements } from "../../customHooks/FetchDataHook";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Spinner from "../../General/Spinner";

import { headers } from "./headers";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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
      <TableRow  key={props.key} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon color="primary" />
            ) : (
              <KeyboardArrowDownIcon color="secondary" />
            )}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">
          {row.name}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">
            {row.product}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">
            {row.quantity}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography color={"info"} variant="subtitle1">
            {row.customer}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">
          {row.owner}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">
          {row.emited}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle1">
            {row.deadLine}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, padding: "15px", borderRadius: "8px", border: "1px solid #777" }}>
              <Typography variant="subtitle1" color={"secondary"} gutterBottom={0} component="div">
                Partes
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography color={"secondary"} variant="subtitle2">
                        Tipo
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color={"secondary"} variant="subtitle2">
                        Nombre
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color={"secondary"} variant="subtitle2">
                      Páginas
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color={"secondary"} variant="subtitle2">
                      Formato
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color={"secondary"} variant="subtitle2">
                      Colores
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color={"secondary"} variant="subtitle2">
                      Material
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Partes?.map((historyRow) => (
                    <TableRow key={historyRow._id}>
                      <TableCell component="th" scope="row">
                        <Typography color={"info"} variant="subtitle2">
                          {historyRow.type}
                        </Typography>
                      </TableCell>
                      <TableCell>{historyRow.name}</TableCell>
                      <TableCell align="left">{historyRow.pages}</TableCell>
                      <TableCell align="left">{historyRow.size}</TableCell>
                      <TableCell align="left">{historyRow.colors}</TableCell>
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


export default function CollapsibleTable(props) {
  const [useLoading, setLoading] = React.useState(true);
  const [useError, setError] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [selected, setSelected] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState("name");
  const [rows, setRows] = React.useState(props.rows);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      props.editor(newSelected);
      return;
    }
    setSelected([]);
    props.editor([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    props.editor(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  let i = 0;

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getPrivateElements("jobs/complete");
        setLoading(false);
        const Rows = res.map((job) => {
          return createData(
            job.Nombre,
            job.Tipo[0]?.name,
            job.Cantidad,
            job.Company.Nombre,
            job.Owner?.Name + " " + job.Owner?.LastName,
            job.Emision,
            job.DeadLine,
            job.Partes
          );
        });
        rows.push(...Rows); // Use spread operator to push elements individually
        setRows([...Rows]); // Update state with the fetched data
      } catch (error) {
        console.log(error);
        setError(error);
      }
    };
    loadData();
  }, []);

  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="info"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headers.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  

  const tableOK = (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        {/* <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Pedido</TableCell>
            <TableCell align="left">Nombre</TableCell>
            <TableCell align="left">Tipo</TableCell>
            <TableCell align="left">Cantidad</TableCell>
            <TableCell align="left">Cliente</TableCell>
            <TableCell align="left">Representante</TableCell>
            <TableCell align="left">Emision</TableCell>
            <TableCell align="left">Entrega</TableCell>
          </TableRow>
        </TableHead> */}
        <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}/>
        <TableBody>
          {visibleRows.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
        <TableFooter>
          <TablePagination 
            count={rows.length}
            rowsPerPageOptions={[5, 10, 15, 20, 25]}
            showFirstButton={true}
            showLastButton={true}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableFooter>
      </Table>
    </TableContainer>
  );

  const alert = <ErrorMessage message={useError?.message} severity="warning" />;

  const spinner = <Spinner />;

  return useLoading ? spinner : useError !== null ? alert : tableOK;
}
