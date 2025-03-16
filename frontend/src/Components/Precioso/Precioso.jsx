import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PricesDataForm from "../Formulario/PricesDataForm";
import PriceTable from "./PriceTable";
import "../../Styles/hamlet.css";
import "../Stocks/Stocks.css";
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
  const Navigate = useNavigate();

  const formulaCLC = (item) => {
    let formula;
    switch (item.Proceso) {
      case "nuvera":
      case "nuvera (LP)":
        formula = formNuvera(item.Valor, item.Minimo, item.Entrada);
        break;
      case "igen color":
      case "igen color (LP)":
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

  const AlertError = (
    <ErrorMessage message={priceList?.message} severity="warning" />
  );

  useEffect(() => {
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
          <Grid xs={12} sm={6} md={4} lg={3} xl={2} key={price._id}>
            <PriceTable
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
