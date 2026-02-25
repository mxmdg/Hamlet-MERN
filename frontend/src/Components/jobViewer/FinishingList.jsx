import React from "react";
import { useEffect, useState } from "react";

import { Button, Typography, Alert, Box } from "@mui/material";

import { themeMxm } from "../Config/theme";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import { ListItemTypographyProps } from "../MaterialCustomStyles/MaterialCustomStyles";

import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import {
  pliegoPorLongitud,
  productoPorUnidad,
  cantidadDeOriginales,
  cantidadDePliegos,
  costoFijo,
} from "../Precioso/formulas";
import { currencyFormat } from "../utils/generalData/numbersAndCurrencies";
import { cleanObsoleteFinishings } from "./CleanObsoletFinishings";
import { UNSAFE_NavigationContext } from "react-router-dom";

const FinishingList = (props) => {
  const [useFinishingCosts, setFinishingCosts] = useState(null);
  const [useSent, setSent] = useState(false);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);
  const [clearError, setClearError] = useState(() => setError(null));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
      transition: "background-color 0.6s ease-out",
      "&:hover": {
        background:
          theme.palette.mode === "dark"
            ? theme.palette.success.main
            : theme.palette.success.main,
      },
    },
    "&:nth-of-type(even)": {
      "&:hover": {
        background:
          theme.palette.mode === "dark"
            ? theme.palette.success.dark
            : theme.palette.success.light,
      },
      transition: "background-color 0.3s ease-in",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const costFunction = (finishing, cantidad) => {
    const calculate = (f) => {
      setSent(false);
      switch (f.Unidad) {
        case "un":
          return productoPorUnidad(
            f.Costo.Valor,
            f.Costo.Minimo,
            f.Costo.Entrada,
            cantidad,
          );

        case "CF":
          return costoFijo(f.Costo.Valor);
        case "or":
          return cantidadDeOriginales(
            f.Costo.Valor,
            f.Costo.Minimo,
            f.Costo.Entrada,
            props.paginas,
          );
        case "pl":
          try {
            if (props.imposition.totalPliegos !== undefined) {
              return cantidadDePliegos(
                f.Costo.Valor,
                f.Costo.Minimo,
                f.Costo.Entrada,
                props.imposition.totalPliegos,
              );
            } else {
              setError({ message: "No hay imposicion", severity: "warning" });
            }
          } catch (error) {
            setClearError(props.clearError404);
            setError({
              message:
                "Error calculando el costo por pliegos: Debe realizarse la imposicion. " +
                error.message,
              severity: "warning",
            });
          }

        case "cm":
          try {
            return pliegoPorLongitud(
              f.Costo.Valor,
              f.Costo.Minimo,
              f.Costo.Entrada,
              Math.ceil(props.imposition.totalPliegos),
              Math.max(
                props.imposition.impositionData.sheetOriginalSize.width,
                props.imposition.impositionData.sheetOriginalSize.height,
              ),
              [508, 660],
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
            cantidad,
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
            //console.log("Es un array de objetos");
            const finisherList = [];
            props.finishing[0] !== null
              ? finisherList((prev) => [
                  ...prev,
                  {
                    Finisher: props.finishing,
                    Cost: costFunction(
                      props.finishing,
                      props.cantidad,
                      props.imposition,
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
                  finisher,
                );
                finisherList.push({
                  Finisher: finishing,
                  Cost: costFunction(
                    finishing,
                    props.cantidad,
                    props.impositionData,
                  ),
                });
              } catch (error) {
                if (error.response?.status === 404) {
                  setError({
                    message:
                      error.response.data?.message || "Finisher inexistente",
                  });
                } else {
                  setError(error);
                }
              }
            }
            setFinishingCosts(finisherList);
          }
        }
      } catch (error) {
        setFinishingCosts([0]);
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
  }, [useFinishingCosts]);

  useEffect(() => {
    setSent(false);
  }, []);

  const totalCost = () => {
    if (useFinishingCosts !== null) {
      //console.log("useFinishingCosts:", useFinishingCosts);
      return useFinishingCosts.reduce((acc, item) => acc + item.Cost.Total, 0);
    }
  };

  const handleSendData = () => {
    props.sendFinishingData(totalCost());
    setSent(true);
  };

  if (useLoading) return <Spinner color="primary" />;

  if (useError)
    return (
      <ErrorMessage
        message={useError.response?.data?.message || useError.message}
        severity={useError.severity || "success"}
        action={() => setError(null)}
        buttonTxt={"Continuar..."}
      />
    );

  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} size="large" aria-label="finishing table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell sx={{ fontWeight: "bold" }}>
              Proceso
            </StyledTableCell>
            <StyledTableCell align="right" sx={{ fontWeight: "bold" }}>
              Valor Unitario
            </StyledTableCell>
            <StyledTableCell align="right" sx={{ fontWeight: "bold" }}>
              Total
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(useFinishingCosts) && useFinishingCosts.length > 0 ? (
            useFinishingCosts.map((item, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {item.Finisher.Proceso}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {currencyFormat(item.Cost.Unitario)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {currencyFormat(item.Cost.Total)}
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={3} align="center">
                No hay procesos de terminación seleccionados.
              </StyledTableCell>
            </StyledTableRow>
          )}
          {Array.isArray(useFinishingCosts) && useFinishingCosts.length > 0 && (
            <StyledTableRow>
              <StyledTableCell
                component="th"
                scope="row"
                sx={{ fontWeight: "bold" }}
              >
                Total
              </StyledTableCell>
              <StyledTableCell />
              <StyledTableCell align="right" sx={{ fontWeight: "bold" }}>
                {currencyFormat(
                  useFinishingCosts.reduce(
                    (acc, item) => acc + item.Cost.Total,
                    0,
                  ),
                )}
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
        <Button
          variant="contained"
          size="large"
          color="success"
          onClick={() => handleSendData()}
          sx={{ fontSize: "1rem", fontWeight: "bold" }}
          disabled={useSent}
        >
          Enviar Datos
        </Button>
      </Box>
    </TableContainer>
  );
};

export default FinishingList;
