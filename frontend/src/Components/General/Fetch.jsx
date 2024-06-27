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

const Fetch = (props) => {
  const [useList, setList] = useState([]);
  const [useFilteredList, setFilteredList] = useState([]);
  const [useSelected, setSelected] = useState([]);
  const [useLoading, setLoading] = useState(true);
  const [useHeaders, setHeaders] = useState([]);
  const [useDeleted, setDeleted] = useState([]);
  const [useErrMessage, setErrMessage] = useState(null);
  const [useColumn, setColumn] = useState("Todo");

  const navigate = useNavigate();

  const getElements = async () => {
    try {
      const elements = await getPrivateElements(
        props.collection + (props.subdir ? `/${props.subdir}` : "")
      );

      setList(elements);

      setHeaders(() => {
        const arr = [];
        const labels = elements.length
          ? Object.getOwnPropertyNames(elements[elements.length - 1]).slice(
              1,
              -1
            )
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
      setErrMessage("No se pudo conectar con el servidor");
      console.log(error);
      return error;
    }
  };

  const filterList = (query, column) => {
    //Inicializar o reiniciar variables
    setFilteredList([]);
    const keys = Object.keys(useList[0]);
    const results = [];

    query = query.toLowerCase();

    const findByColumn = (col) => {
      for (let item of useList) {
        try {
          const cellToString = item[col].toString().toLowerCase();
          if (cellToString.includes(query.toString())) {
            console.log(item[col], query);
            results.push(item);
          }
        } catch (error) {
          setErrMessage("Error en la busqueda: " + error.message);
        }
      }
    };

    const findAll = () => {
      for (let item of useList) {
        for (let key of keys) {
          //console.log(key + " -> Problema en impresoras");
          try {
            const cellToString = item[key].toString().toLowerCase();
            if (cellToString.includes(query.toString())) {
              console.log(item[key], query);
              results.push(item);
              break; // Evitar duplicados al encontrar coincidencia en cualquier columna
            }
          } catch (error) {
            setErrMessage("Error en la busqueda: " + error.message);
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
    const fetchData = async () => {
      try {
        await getElements();
        setFilteredList([]);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setErrMessage(err.response?.data?.message || err.message);
        setLoading(false);
        return err;
      }
    };
    fetchData();
    console.log(useList);
  }, [useErrMessage, useDeleted, props.collection]);

  const Loading = (
    <Container>
      <CircularColor />
    </Container>
  );

  const AlertError = (
    <ErrorMessage message={useErrMessage} severity={"warning"} />
  );

  const TableLoaded = (
    <>
      <DarkWoodCard>
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
      </DarkWoodCard>

      <DarkWoodCard>
        <EnhancedTable
          rows={
            useFilteredList.length > 0
              ? useFilteredList
              : useList.length > 0
              ? useList
              : [, , ,]
          }
          headCells={useHeaders}
          collection={props.collection}
          editor={setSelected}
          selected={useSelected}
          deleted={setDeleted}
        />
      </DarkWoodCard>
    </>
  );

  return useLoading
    ? Loading
    : useErrMessage !== null
    ? AlertError
    : TableLoaded;
};

export default Fetch;
