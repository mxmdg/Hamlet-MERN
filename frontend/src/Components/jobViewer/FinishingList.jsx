import React from "react";
import { useEffect, useState } from "react";

import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Alert,
} from "@mui/material";

import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import { pliegoPorLongitud, productoPorUnidad } from "../Precioso/formulas";
import { currencyFormat } from "../utils/generalData/numbersAndCurrencies";

const FinishingList = (props) => {
  const [useFinishingCosts, setFinishingCosts] = useState(null);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);

  const costFunction = (finishing, cantidad) => {
    const calculate = (f) => {
      switch (f.Unidad) {
        case "un":
          return productoPorUnidad(
            f.Costo.Valor,
            f.Costo.Minimo,
            f.Costo.Entrada,
            cantidad
          );
        case "cm":
          try {
            return pliegoPorLongitud(
              f.Costo.Valor,
              f.Costo.Minimo,
              f.Costo.Entrada,
              Math.ceil(props.imposition.totalPliegos),
              Math.max(
                props.imposition.impositionData.sheetOriginalSize.width,
                props.imposition.impositionData.sheetOriginalSize.height
              ),
              [508, 660]
            );
          } catch (error) {
            setError({
              message:
                "Error calculando el costo por longitud: Debe realizarse la imposicion. " +
                error.message,
              severity: "warning",
            });
          }

        default:
          return productoPorUnidad(
            f.Costo.Valor,
            f.Costo.Minimo,
            f.Costo.Entrada,
            cantidad
          );
      }
    };
    return calculate(finishing);
  };

  useEffect(() => {
    const fetchFinishingDetails = async () => {
      try {
        if (Array.isArray(props.finishing) && props.finishing.length > 0) {
          if (typeof props.finishing[0] === "object") {
            console.log("Es un array de objetos");
            const finisherList = [];
            props.finishing[0] !== null
              ? finisherList((prev) => [
                  ...prev,
                  {
                    Finisher: props.finishing,
                    Cost: costFunction(
                      props.finishing,
                      props.cantidad,
                      props.imposition
                    ),
                  },
                ])
              : setFinishingCosts([]);
          } else {
            const finisherList = [];
            for (const finisher of props.finishing) {
              try {
                const finishing = await getPrivateElementByID(
                  "finishers",
                  finisher
                );
                finisherList.push({
                  Finisher: finishing.data,
                  Cost: costFunction(
                    finishing.data,
                    props.cantidad,
                    props.impositionData
                  ),
                });
              } catch (error) {
                console.log(error);
                setError(error);
              }
            }
            setFinishingCosts(finisherList);
          }
        }
      } catch (error) {
        setError({
          message:
            "Error accediendo a los procesos de terminacion: " + error.message,
        });
      } finally {
        if (useFinishingCosts !== null) {
          props.sendFinishingData(totalCost());
        }
        setLoading(false);
      }
    };

    fetchFinishingDetails();
  }, []);

  const totalCost = () => {
    if (useFinishingCosts !== null) {
      return useFinishingCosts.reduce((acc, item) => acc + item.Cost.Total, 0);
    }
  };

  const handleSendData = () => {
    props.sendFinishingData(totalCost());
  };

  if (useLoading) return <Spinner color="primary" />;
  if (useError)
    return (
      <ErrorMessage
        message={useError.message}
        severity={useError.severity || "error"}
        action={() => setError(null)}
      />
    );

  return (
    <List dense>
      {Array.isArray(useFinishingCosts) && useFinishingCosts.length > 0 ? (
        useFinishingCosts.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.Finisher.Proceso}
              secondary={`${currencyFormat(
                item.Cost.Total
              )} (Unitario: ${currencyFormat(item.Cost.Unitario)})`}
            />
          </ListItem>
        ))
      ) : (
        <Alert severity="warning" variant="filled">
          No hay procesos de terminacion seleccionados.
        </Alert>
      )}
      {Array.isArray(useFinishingCosts) && useFinishingCosts.length > 0 && (
        <ListItem>
          <ListItemText
            primary="Total"
            secondary={`${currencyFormat(
              useFinishingCosts.reduce((acc, item) => acc + item.Cost.Total, 0)
            )}`}
          />
        </ListItem>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleSendData()}
      >
        Enviar Datos
      </Button>
    </List>
  );
};

export default FinishingList;
