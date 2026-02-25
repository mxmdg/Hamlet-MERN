import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

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

const FinishingListAuto = (props) => {
  const [useFinishingCosts, setFinishingCosts] = useState(null);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);

  // Ref para evitar bucles infinitos comparando el último total enviado
  const lastSentTotal = useRef(null);

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
    "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
    "&:last-child td, &:last-child th": { border: 0 },
  }));

  const costFunction = (finishing, cantidad) => {
    const calculate = (f) => {
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
          if (props.imposition?.totalPliegos !== undefined) {
            return cantidadDePliegos(
              f.Costo.Valor,
              f.Costo.Minimo,
              f.Costo.Entrada,
              props.imposition.totalPliegos,
            );
          }
          return { Unitario: 0, Total: 0 };
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
          } catch {
            return { Unitario: 0, Total: 0 };
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

  // 1. CÁLCULO DE COSTOS
  useEffect(() => {
    const fetchFinishingDetails = async () => {
      setLoading(true);
      try {
        if (Array.isArray(props.finishing) && props.finishing.length > 0) {
          const finisherList = [];
          for (const finisherId of props.finishing) {
            // Soporta tanto objetos completos como IDs
            const finishing =
              typeof finisherId === "object"
                ? finisherId
                : await getPrivateElementByID("finishers", finisherId);

            finisherList.push({
              Finisher: finishing,
              Cost: costFunction(finishing, props.cantidad),
            });
          }
          setFinishingCosts(finisherList);
        } else {
          setFinishingCosts([]);
        }
      } catch (error) {
        setError({ message: "Error en procesos: " + error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchFinishingDetails();
  }, [props.finishing, props.cantidad, props.imposition, props.paginas]);

  // 2. ENVÍO AUTOMÁTICO AL PADRE
  useEffect(() => {
    if (useFinishingCosts !== null && !useLoading) {
      const total = useFinishingCosts.reduce(
        (acc, item) => acc + (item.Cost?.Total || 0),
        0,
      );

      // Solo enviamos si el total realmente cambió para evitar re-renders infinitos
      if (total !== lastSentTotal.current) {
        lastSentTotal.current = total;
        props.sendFinishingData(total);
      }
    }
  }, [useFinishingCosts, useLoading]);

  if (useLoading) return <Spinner color="primary" />;

  if (useError)
    return (
      <ErrorMessage message={useError.message} action={() => setError(null)} />
    );

  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} size="small">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Proceso</StyledTableCell>
            <StyledTableCell align="right">Unitario</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {useFinishingCosts?.length > 0 ? (
            useFinishingCosts.map((item, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{item.Finisher?.Proceso}</StyledTableCell>
                <StyledTableCell align="right">
                  {currencyFormat(item.Cost?.Unitario)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {currencyFormat(item.Cost?.Total)}
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={3} align="center">
                Sin procesos
              </StyledTableCell>
            </StyledTableRow>
          )}
          {useFinishingCosts?.length > 0 && (
            <StyledTableRow>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                Total Terminación
              </StyledTableCell>
              <StyledTableCell />
              <StyledTableCell align="right" sx={{ fontWeight: "bold" }}>
                {currencyFormat(lastSentTotal.current)}
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinishingListAuto;
