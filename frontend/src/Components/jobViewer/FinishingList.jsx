import React from "react";
import { useEffect, useState } from "react";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";
import { pliegoPorLongitud, productoPorUnidad } from "../Precioso/formulas";

const FinishingList = (props) => {
  const [useFinishing, setFinishing] = useState(props.finishing || null);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);

  useEffect(() => {
    const fetchFinishingDetails = async (costFunction = Function) => {
      try {
        if (Array.isArray(props.finishing) && props.finishing.length > 0) {
          console.log("Tenemos un array: props.finishing", props.finishing);
          if (typeof props.finishing[0] === "object") {
            console.log("Es un array de objetos");
            const finisherList = [];
            props.finishing[0] !== null
              ? finisherList((prev) => [
                  ...prev,
                  {
                    Finisher: props.finishing,
                    Cost: costFunction(props.finishing, props.cantidad),
                  },
                ])
              : setFinishing([]);
          } else {
            console.log("Es un array de IDs");
            const finisherList = [];
            for (const finisher of props.finishing) {
              try {
                const finishing = await getPrivateElementByID(
                  "finishers",
                  finisher
                );
                finisherList.push({
                  Finisher: finishing.data,
                  Cost: costFunction(finishing.data.Costo, props.cantidad),
                });
              } catch (error) {
                console.log(error);
                setError(error);
              }
            }
            setFinishing(finisherList);
            console.log("finisherList", finisherList);
          }
        }
      } catch (error) {
        setError({
          message:
            "Error accediendo a los procesos de terminacion: " + error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinishingDetails(productoPorUnidad);
  }, [props.finishing]);

  if (useLoading) return <Spinner color="primary" />;
  if (useError)
    return <ErrorMessage message={useError.message} severity={"error"} />;

  return (
    <List dense>
      {useFinishing.map((item, index) => (
        <ListItem key={index}>
          <Typography variant="h6">
            {`${item.Finisher.Proceso} $${item.Cost.Total} (Unitario: $${item.Cost.Unitario})`}
          </Typography>
          <Typography variant="body"></Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default FinishingList;
