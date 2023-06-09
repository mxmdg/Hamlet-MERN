import React, { useState, useEffect } from "react";
import axios from "axios";
import StockDataForm from "../Formulario/StockDataForm";
import ItemsDetails from "../General/itemsDetails";
// import "../../Styles/hamlet.css";
// import "./Stocks.css";
import { serverURL } from "../Config/config";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

const Stocks = (props) => {
  const [stockList, setStockList] = useState([]);
  const [useEdit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverURL}/hamlet/${props.collection}`);
        setStockList(res.data);
        setEdit(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [useEdit]);

  return (
    <Grid container spacing={3}>
      {/* Renderiza la lista de materiales */}
      {stockList.map((stock) => (
        <Grid xs={12} md={4}>
        <ItemsDetails
          pd={stock}
          key={stock._id}
          id={stock._id}
          collection={props.collection}
          formData={StockDataForm}
          editor={setEdit}
        />
        </Grid>
      ))}
    </Grid>
  );
};

export default Stocks;
