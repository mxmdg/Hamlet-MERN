import React, { useState, useEffect } from "react";
import axios from "axios";
import PricesDataForm from "../Formulario/PricesDataForm";
import ItemsDetails from "../General/itemsDetails";
import PriceTable from "./PriceTable";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
import { serverURL } from "../Config/config";
import {
  formNuvera,
  formIgenColor,
  formLaminado,
  formEncuadernacion,
  formIgenBN,
  formDefault,
} from "./updateService";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

const Precioso = (props) => {
  const [priceList, setPriceList] = useState([]);
  const [useEdit, setEdit] = useState(false);

  const formulaCLC = (item) => {
    let formula;
    switch (item.Proceso) {
      case "nuvera":
        formula = formNuvera(item.Valor, item.Minimo, item.Entrada);
        break;
      case "igen color":
        formula = formIgenColor(item.Valor, item.Minimo, item.Entrada);
        break;
      case "laminado":
        formula = formLaminado(item.Valor, item.Minimo, item.Entrada);
        break;
      case "acaballado":
      case "pur":
      case "eva":
      case "anillado":
        formula = formEncuadernacion(item.Valor, item.Minimo, item.Entrada);
        break;
      case "igen b&n":
        formula = formIgenBN(item.Valor, item.Minimo, item.Entrada);
        break;
      default:
        formula = formDefault(item.Valor, item.Minimo, item.Entrada);
        break;
    }

    return formula;
  };

  useEffect(() => {
    const getElements = async () => {
      const prices = await axios.get(
        `${serverURL}/hamlet/${props.collection}/`
      );
      setPriceList(prices.data);
      setEdit(false);
      console.log(prices);
    };

    const fetchData = async () => {
      try {
        getElements();
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [useEdit, props.priceState]);

  return (
    <>
      <Grid container spacing={3}>
        {/* Renderiza la lista de Formatos */}
        {priceList.map((price) => (
          <Grid xs={12} md={4} key={price._id}>
            <PriceTable
              pd={price}
              collection={props.collection}
              id={price._id}
              formCLC={formulaCLC(price)}
              formData={PricesDataForm}
              editor={setEdit}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Precioso;
