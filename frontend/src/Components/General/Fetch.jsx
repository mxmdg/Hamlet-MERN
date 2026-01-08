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
import Spinner from "./Spinner";
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

  const orderObjectProperties = (obj, headers) => {
    const ordered = {};
    headers.forEach((h) => {
      if (obj.hasOwnProperty(h.id)) {
        ordered[h.id] = obj[h.id];
        //console.log(h.id + ": " + obj[h.id]);
      }
    });
    return ordered;
  };

  const getElements = async () => {
    let elements = await getPrivateElements(
      props.collection + (props.subdir ? `/${props.subdir}` : "")
    );

    if (props.collection === "memberships") {
      elements = await flattenArrayOfObjects(elements);
    }

    Array.isArray(elements)
      ? setHeaders(() => {
          const arr = [];
          const labels = elements.length
            ? Object.getOwnPropertyNames(elements[0])
            : ["Error", "Datos inexistentes"];
          labels.map((e) => {
            const obj = {
              id: e,
              numeric: false,
              disablePadding: false,
              label: e,
            };
            // arr.push(obj)
            e !== "id" && e !== "__v" ? arr.push(obj) : console.log(e);
          });
          const orderedElements = elements.map((e) =>
            orderObjectProperties(e, arr)
          );
          console.log(orderedElements);
          setList(orderedElements);
          return arr;
        })
      : setErrMessage(
          "Error: " + elements.response.data.message ||
            elements.message ||
            "Error desconocido"
        );

    return elements;
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
  }, [useDeleted, props.collection]);

  const Loading = <Spinner />;

  const AlertError = (
    <ErrorMessage
      message={useErrMessage}
      severity={"warning"}
      action={() => {
        setErrMessage(null);
      }}
      title="No es posible acceder a la base de datos"
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
          rows={useFilteredList.length > 0 ? useFilteredList : useList}
          headCells={useHeaders}
          collection={props.collection}
          editor={setSelected}
          selected={useSelected}
          deleted={setDeleted}
        />
      </DarkWoodCard>
    </>
  );

  return useLoading ? Loading : useErrMessage ? AlertError : TableLoaded;
};

export default Fetch;
