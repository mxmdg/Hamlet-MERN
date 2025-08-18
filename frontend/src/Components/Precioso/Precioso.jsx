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
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ButtonGroup from "@mui/material/ButtonGroup";
import Spinner from "../General/Spinner";
import { getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { TextField, MenuItem } from "@mui/material";
import { orderArrayByKey } from "../utils/generalData/arrayNormalizer";

const Precioso = (props) => {
  const [priceList, setPriceList] = useState(null);
  const [useEdit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useErrorMessage, setErrorMessage] = useState();
  const [orderer, setOrderer] = useState({ key: "Proceso", asc: true }); // Default order by "Proceso" ascending
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
        setPriceList(orderArrayByKey(prices, orderer.key, orderer.asc));
        setEdit(false);
        setLoading(false);
      } catch (e) {
        setErrorMessage(e);
        console.log(useErrorMessage.message);
        return;
      }
    };
    fetchData();
  }, [
    useEdit,
    setErrorMessage,
    orderer.key,
    orderer.asc,
    setPriceList,
    props.priceState,
  ]);

  return (
    <Grid container columns={{ xs: 2, sm: 12, md: 12 }} spacing={2}>
      {loading ? (
        <Spinner color="primary" /> // Asegúrate de importar el componente Spinner si lo tienes
      ) : useErrorMessage !== undefined || priceList.message ? (
        AlertError
      ) : (
        // Renderiza la lista de Precios
        //priceList &&

        <>
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} key="orderer">
            <ButtonGroup variant="outlined" size="small" color="secondary">
              <TextField
                variant="outlined"
                fullWidth
                color="secondary"
                label="Ordenar por"
                size="small"
                onChange={(e) => {
                  setOrderer({ key: e.target.value, asc: true });
                  setPriceList((prevList) =>
                    orderArrayByKey(prevList, orderer.key, orderer.order)
                  );
                }}
                select
              >
                {priceList[0] &&
                  Object.keys(priceList[0]).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
              </TextField>
              <Button
                size="small"
                onClick={() => {
                  setOrderer((prev) => ({ ...prev, asc: !prev.asc }));
                }}
              >
                {orderer.asc ? <ArrowDropUp /> : <ArrowDropDown />}
              </Button>
            </ButtonGroup>
          </Grid>
          {priceList.map((price) => (
            <Grid xs={12} sm={6} md={4} lg={3} xl={2} key={price._id}>
              <PriceTable
                pd={price}
                collection={props.collection}
                id={price._id}
                formCLC={formulaCLC(price)}
                formData={PricesDataForm}
                editor={setEdit}
                cotization={props.cotization}
              />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};

export default Precioso;
