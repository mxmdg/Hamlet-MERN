import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemsDetails from "./itemsDetails";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
import { databaseURL } from "../Config/config";
import ItemsTable from "./ItemsTable";
import CircularColor from "./Spinner";
import { Paper, Container, TextField, MenuItem, Stack } from "@mui/material";
import EnhancedTable from "./TableGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import DarkWoodCard from "../utils/DarkWoodCard";
import { useNavigate } from "react-router-dom";
import { fechtData, getPrivateElements } from "../customHooks/FetchDataHook";
import flattenArrayOfObjects from "../utils/flattener/flatenDicts";
import { Filter } from "../customHooks/Filter";
import { PartsTable, createData } from "../Jobs/jobsTable/CollapsibleTable";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

const FetchParts = (props) => {
  const [useList, setList] = useState([]);
  const [useFilteredList, setFilteredList] = useState([]);
  const [rows, setRows] = useState([]);
  const [useLoading, setLoading] = useState(true);
  const [useHeaders, setHeaders] = useState([]);
  const [useDeleted, setDeleted] = useState([]);
  const [useErrMessage, setErrMessage] = useState(null);
  const [useColumn, setColumn] = useState("Todo");
  const [useError, setError] = useState(null);
  const [orderBy, setOrderBy] = React.useState();
  const [filteredRows, setFilteredRows] = React.useState(props.rows);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const navigate = useNavigate();

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  

  const filterList = (query, column) => {
    //Inicializar o reiniciar variables
    setFilteredList([]);
    const keys = Object.keys(useList[0]);
    const results = [];

    query = query.toLowerCase();

    const findByColumn = (col) => {
      for (let item of useList) {
        const cellToString = item[col].toString().toLowerCase();
        if (cellToString.includes(query.toString())) {
          console.log(item[col], query);
          results.push(item);
        }
      }
    };

    const findAll = () => {
      for (let item of useList) {
        for (let key of keys) {
          //console.log(key + " -> Problema en impresoras");
          const cellToString = item[key].toString().toLowerCase();
          if (cellToString.includes(query.toString())) {
            console.log(item[key], query);
            results.push(item);
            break; // Evitar duplicados al encontrar coincidencia en cualquier columna
          }
        }
      }
    };

    console.log(results);

    column === "Todo" ? findAll() : findByColumn(column);
    setFilteredList(results);

    if (query.length > 0 && results.length < 1) {
      setFilteredList([,]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getPrivateElements(
          props.collection + (props.subdir ? `/${props.subdir}` : "")
        );
        setLoading(false);
        const arr = [];
        res.map((p) => {
          const data = {
            type: p.jobParts[0].Type,
            name: p.Name,
            pages: p.Pages,
            size: `${p.Ancho} x ${p.Alto} mm`,
            colors: `${p.ColoresFrente} / ${p.ColoresDorso || "0"}`,
            stock: `${p.partStock.Marca} ${p.partStock.Tipo} ${p.partStock.Gramaje}`,
            _id: p._id,
          }
        arr.push(data);
        });
        setList(arr)
        setHeaders(() => {
          const arr = [];
          const labels = useList.length > 0
            ? Object.getOwnPropertyNames(useList[0])
            : ["Error", "Datos inexistentes"];
          labels.map((e) => {
            const obj = {
              id: e,
              numeric: false,
              disablePadding: false,
              label: e,
            };
            arr.push(obj);
          });
          return arr;
        });    
      } catch (error) {
        console.log(error);
        setError(error);
      }
    };
    loadData();
  }, [setRows]);

  const Loading = (
    <Container>
      <CircularColor />
    </Container>
  );

  const AlertError = (
    <ErrorMessage
      message={useErrMessage}
      severity={"warning"}
      action={() => {
        navigate(-1);
      }}
    />
  );

  const TableLoaded = (
    <>
      {/* <Filter
        headers={useHeaders}
        data={useList}
        setFilteredList={setFilteredList}
      /> */}
      <DarkWoodCard>
        <Paper elevation={4} color="info" sx={{ padding: "10px" }}>
          <Stack direction="row" spacing={4}>
            <TextField
              select
              defaultValue={"Todo"}
              onChange={(e) => setColumn(e.target.value)}
              variant="filled"
              color="success"
              size="small"
            >
              {useHeaders.map((item) => {
                return (
                  <MenuItem value={item.label} key={item.id}>
                    {item.label}
                  </MenuItem>
                );
              })}
              <MenuItem value={"Todo"} key="opt0">
                Todo
              </MenuItem>
            </TextField>
            <TextField
              variant="filled"
              type="search"
              onChange={(e) => {
                filterList(e.target.value, useColumn);
              }}
              placeholder="Buscar"
              color="success"
              size="small"
            ></TextField>
          </Stack>
        </Paper>
      </DarkWoodCard>

      <DarkWoodCard>
        <PartsTable
          data={useFilteredList.length > 0 ? useFilteredList : useList}
        />
        <TablePagination
        component="div"
        count={rows.length}
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
        showFirstButton={true}
        showLastButton={true}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </DarkWoodCard>
    </>
  );

  return useLoading ? Loading : useErrMessage ? AlertError : TableLoaded;
};

export default FetchParts;
