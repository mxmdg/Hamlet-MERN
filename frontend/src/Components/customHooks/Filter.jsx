import React, { useState, useEffect } from "react";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
import { Paper, Container, TextField, MenuItem, Stack } from "@mui/material";
import DarkWoodCard from "../utils/DarkWoodCard";

export const Filter = (props) => {
  const [useColumn, setColumn] = useState("Todo");
  const [useDataList, setDataList] = useState(props.data);
  const [useHeaders, setHeaders] = useState(props.headers);

  const filterList = (query, column) => {
    props.setFilteredList([]);
    const keys = useHeaders;
    const results = [];

    query = query.toLowerCase();

    const findByColumn = (col) => {
      for (let item of useDataList) {
        const cellToString = item[col].toString().toLowerCase();
        if (cellToString.includes(query.toString())) {
          results.push(item);
        }
      }
    };

    const findAll = () => {
      for (let item of useDataList) {
        for (let key of keys) {
          const cellToString = item[key?.id].toString().toLowerCase();
          if (cellToString.includes(query.toString())) {
            results.push(item);
            break;
          }
        }
      }
    };

    column === "Todo" ? findAll() : findByColumn(column);
    props.setFilteredList(results);

    if (query.length > 0 && results.length < 1) {
      props.setFilteredList([,]);
    }
  };
  

  useEffect(() => {
    if (props.filter) {
      setTimeout(()=>{
        filterList(props.filter, useColumn);
        console.log("0.05 seconds")
      },0);
    }
  }, [props.filter, useColumn, useDataList, useHeaders,props.setFilteredList]); // Observar cambios relevantes

  return (
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
              <MenuItem value={item.id} key={item.id}>
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
          defaultValue={props.filter ? props.filter : ""}
          onFocusCapture={(e) => {
            filterList(e.target.value, useColumn);
          }}
          onChange={(e) => {
            filterList(e.target.value, useColumn);
          }}
          placeholder="Buscar"
          color="success"
          size="small"
          focused={true}

        ></TextField>
      </Stack>
    </Paper>
  );
};
