import React from "react";
import { useEffect, useState } from "react";

import { Button, Typography, Alert, Box } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { ListItemTypographyProps } from "../MaterialCustomStyles/MaterialCustomStyles";

import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import {
  pliegoPorLongitud,
  productoPorUnidad,
  costoFijo,
} from "../Precioso/formulas";
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

        case "CF":
          return costoFijo(f.Costo.Valor);
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
        /* if (useFinishingCosts !== null) {
          props.sendFinishingData(totalCost());
        } */
        setLoading(false);
      }
    };

    fetchFinishingDetails();
  }, []);

  const totalCost = () => {
    if (useFinishingCosts !== null) {
      console.log("useFinishingCosts:", useFinishingCosts);
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
        message={useError.response?.data?.message || useError.message}
        severity={useError.severity || "error"}
        variant="standard"
        action={() => setError(null)}
      />
    );

  return (
    <TableContainer sx={{ margin: 0, padding: 0 }}>
      <Table sx={{ minWidth: 300 }} size="small" aria-label="finishing table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
              Proceso
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", padding: "4px" }}
            >
              Valor Unitario
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", padding: "4px" }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(useFinishingCosts) && useFinishingCosts.length > 0 ? (
            useFinishingCosts.map((item, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" sx={{ padding: "4px" }}>
                  {item.Finisher.Proceso}
                </TableCell>
                <TableCell align="right" sx={{ padding: "4px" }}>
                  {currencyFormat(item.Cost.Unitario)}
                </TableCell>
                <TableCell align="right" sx={{ padding: "4px" }}>
                  {currencyFormat(item.Cost.Total)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ padding: "4px" }}>
                No hay procesos de terminación seleccionados.
              </TableCell>
            </TableRow>
          )}
          {Array.isArray(useFinishingCosts) && useFinishingCosts.length > 0 && (
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ fontWeight: "bold", padding: "4px" }}
              >
                Total
              </TableCell>
              <TableCell />
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", padding: "4px" }}
              >
                {currencyFormat(
                  useFinishingCosts.reduce(
                    (acc, item) => acc + item.Cost.Total,
                    0
                  )
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleSendData()}
          sx={{ fontSize: "0.8rem" }}
        >
          Enviar Datos
        </Button>
      </Box>
    </TableContainer>
  );
};

export default FinishingList;
