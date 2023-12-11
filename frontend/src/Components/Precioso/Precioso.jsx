import React, { useState, useEffect } from "react";
import axios from "axios";
import PricesDataForm from "../Formulario/PricesDataForm";
import ItemsDetails from "../General/itemsDetails";
import PriceTable from "./PriceTable";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
import { databaseURL } from "../Config/config";
import {
  formNuvera,
  formIgenColor,
  formLaminado,
  formEncuadernacion,
  formIgenBN,
  formDefault,
} from "./updateService";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Spinner from "../General/Spinner";
import { getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const Precioso = (props) => {
  const [priceList, setPriceList] = useState(null);
  const [useEdit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useErrorMessage, setErrorMessage] = useState();

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

  const AlertError = <ErrorMessage message={priceList?.message} />;

  useEffect(() => {
    /* const getElements = async () => {
      try {
        const prices = await axios.get(`${databaseURL + props.collection}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
      } catch (e) {
        console.log(e);
      }
    }; */

    const fetchData = async () => {
      try {
        const prices = await getPrivateElements(props.collection);
        setPriceList(prices);
        setEdit(false);
        setLoading(false);
      } catch (e) {
        setErrorMessage(e);
        console.log(useErrorMessage.message);
        return;
      }
    };
    fetchData();
  }, [useEdit, setErrorMessage, setPriceList, props.priceState]);

  return (
    <Grid container columns={{ xs: 2, sm: 12, md: 12 }} spacing={2}>
      {loading ? (
        <Spinner color="primary" /> // Asegúrate de importar el componente Spinner si lo tienes
      ) : useErrorMessage !== undefined || priceList.message ? (
        AlertError
      ) : (
        // Renderiza la lista de Precios
        //priceList &&
        priceList.map((price) => (
          <Grid item xs={12} sm={6} md={4}>
            <PriceTable
              key={price._id}
              pd={price}
              collection={props.collection}
              id={price._id}
              formCLC={formulaCLC(price)}
              formData={PricesDataForm}
              editor={setEdit}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Precioso;
