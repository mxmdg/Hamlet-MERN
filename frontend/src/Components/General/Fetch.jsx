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

const Fetch = (props) => {
  const [useList, setList] = useState([]);
  const [useSelected, setSelected] = useState([]);
  const [useLoading, setLoading] = useState(true);
  const [useHeaders, setHeaders] = useState([]);
  const [useDeleted, setDeleted] = useState([]);

  const getElements = async () => {
    const elements = await axios.get(`${databaseURL + props.collection}/`);
    console.table(elements.data);
    setList(Object.values(elements.data));
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getElements();
        setLoading(false);
      } catch (err) {
        alert(err);
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
  const TableLoaded = (
    <>
      <Container>
        {/* <ItemsTable
          itemList={useList}
          collection={props.collection}
          //formData={DataForm}
          //editor={setEdit}
        /> */}
        <EnhancedTable
          rows={useList}
          headCells={useHeaders}
          collection={props.collection}
          editor={setSelected}
          selected={useSelected}
          deleted={setDeleted}
        />
      </Container>
    </>
  );

  return useLoading ? Loading : TableLoaded;
};

export default Fetch;
