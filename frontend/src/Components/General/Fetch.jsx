import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemsDetails from "./itemsDetails";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
import { databaseURL } from "../Config/config";
import ItemsTable from "./ItemsTable";
import CircularColor from "./Spinner";
import { Container } from "@mui/material";
import EnhancedTable from "./TableGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const Fetch = (props) => {
  const [useList, setList] = useState([]);
  const [useFilteredList, setFilteredList] = useState([]);
  const [useSelected, setSelected] = useState([]);
  const [useLoading, setLoading] = useState(true);
  const [useHeaders, setHeaders] = useState([]);
  const [useDeleted, setDeleted] = useState([]);
  const [useErrMessage, setErrMessage] = useState(null);
  const [useColumn, setColumn] = useState("Todo");

  const getElements = async () => {
    const elements = await axios.get(`${databaseURL + props.collection}/`);
    console.table(elements.data);
    setList(elements.data);
    setHeaders(() => {
      const arr = [];
      const labels = elements.data.length
        ? Object.getOwnPropertyNames(elements.data[0]).slice(1, -1)
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
  };

  const filterList = (query, column) => {
    //Inicializar o reiniciar variables
    setFilteredList([]);
    const keys = Object.keys(useList[0]);
    const results = [];

    const findByColumn = (col) => {
      for (let item of useList) {
        const cellToString = item[col].toString();
        if (cellToString.includes(query.toString())) {
          console.log(item[col], query);
          results.push(item);
        }
      }
    };

    console.log(results);

    findByColumn(column);
    setFilteredList(results);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getElements();
        setLoading(false);
      } catch (err) {
        console.log(err);
        setErrMessage(err);
        setLoading(false);
        return err;
      }
    };
    fetchData();
    console.log(useList);
  }, [useSelected, useDeleted, props.collection]);

  const Loading = (
    <Container>
      <CircularColor />
    </Container>
  );

  const AlertError = <ErrorMessage message={useErrMessage?.message} />;

  const TableLoaded = (
    <>
      <Container>
        <select
          defaultValue={"Todo"}
          onChange={(e) => setColumn(e.target.value)}
        >
          {useHeaders.map((item) => {
            return (
              <option value={item.label} key={item.id}>
                {item.label}
              </option>
            );
          })}
          <option value={"Todo"} key="opt0">
            Todo
          </option>
        </select>
        <input
          type="text"
          onChange={(e) => {
            filterList(e.target.value, useColumn);
          }}
          placeholder="Buscar"
        ></input>
        <EnhancedTable
          rows={useFilteredList.length > 0 ? useFilteredList : useList}
          headCells={useHeaders}
          collection={props.collection}
          editor={setSelected}
          selected={useSelected}
          deleted={setDeleted}
        />
      </Container>
    </>
  );

  return useLoading ? Loading : useErrMessage ? AlertError : TableLoaded;
};

export default Fetch;
