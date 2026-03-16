import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
import { Paper, Container, TextField, MenuItem, Stack } from "@mui/material";
import EnhancedTable from "./TableGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "./Spinner";
import DarkWoodCard from "../utils/DarkWoodCard";
import { useNavigate } from "react-router-dom";
import { fechtData, getPrivateElements, importFromPapyrus } from "../customHooks/FetchDataHook";
import flattenArrayOfObjects from "../utils/flattener/flatenDicts";


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
  //const url = process.env.REACT_APP_PAPYRUS_API || "http://181.104.19.45:3001/api/papyrus/extract";

  const context = useContext(AuthContext)

  const url = context.useSettings.extensions.papyrusExtractUrl

  const orderObjectProperties = (obj, headers) => {
    const ordered = {};
    headers.forEach((h) => {
      if (obj.hasOwnProperty(h.id)) {
        ordered[h.id] = obj[h.id];
      }
    });
    return ordered;
  };

  const getElements = async () => {
    let elements

    if (props.collection === 'papyrus') {
      elements = await importFromPapyrus(props.querySQL, url)
      console.log(elements)
    } else {
      elements = await getPrivateElements(
      props.collection + (props.subdir ? `/${props.subdir}` : "")
    );
    }

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
            if (e !== "id" && e !== "__v") {
              arr.push(obj);
            }
          });
          const orderedElements = elements.map((e) =>
            orderObjectProperties(e, arr)
          );
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
          try {
            const cellToString = item[key].toString().toLowerCase();
            if (cellToString.includes(query.toString())) {
              results.push(item);
              break; // Evitar duplicados al encontrar coincidencia en cualquier columna
            }
          } catch (error) {
            setErrMessage("Error en la busqueda: " + error.message);
          }
        }
      }
    };

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
        setErrMessage(err.response?.data?.message || err.message);
        setLoading(false);
        return err;
      }
    };
    fetchData();
  }, [useDeleted, props.collection]);

  const Loading = <Spinner />;

  const AlertError = (
    <ErrorMessage
      message={useErrMessage}
      severity={"warning"}
      action={() => {
        setErrMessage(null);
      }}
      title="Error consultando la base datos"
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
