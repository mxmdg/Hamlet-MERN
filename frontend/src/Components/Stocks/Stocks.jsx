import React, { useState, useEffect } from "react";
import axios from "axios";
import StockDataForm from "../Formulario/StockDataForm";
import ItemsDetails from "../General/itemsDetails";
import "../../Styles/hamlet.css";
import "./Stocks.css";
import { serverURL } from "../Config/config";
import Box from "@mui/material/Box";
import Grid from "@mui/material/InputLabel";

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
    <div className="printersMainContainer">
      {/* Renderiza la lista de materiales */}
      {stockList.map((stock) => (
        <ItemsDetails
          pd={stock}
          key={stock._id}
          id={stock._id}
          collection={props.collection}
          formData={StockDataForm}
          editor={setEdit}
        />
      ))}
    </div>
  );
};

export default Stocks;
