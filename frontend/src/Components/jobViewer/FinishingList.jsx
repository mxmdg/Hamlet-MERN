import React from "react";
import { useEffect, useState } from "react";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

const FinishingList = (props) => {
  const [useFinishing, setFinishing] = useState(props.finishing || null);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);

  useEffect(() => {
    const fetchFinishingDetails = async () => {
      try {
        if (Array.isArray(props.finishing) && props.finishing.length > 0) {
          console.log("Tenemos un array: props.finishing", props.finishing);
          if (typeof props.finishing[0] === "object") {
            console.log("Es un array de objetos");
            props.finishing[0] !== null
              ? setFinishing(props.finishing)
              : setFinishing([]);
          } else {
            console.log("Es un array de IDs");
            const finisherList = [];
            for (const finisher of props.finishing) {
              const finishing = await getPrivateElementByID(
                "finishers",
                finisher
              );
              finisherList.push(finishing.data);
            }
            setFinishing(finisherList);
            console.log("finisherList", finisherList);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishingDetails();
  }, [props.finishing]);

  if (useLoading) return <Spinner color="primary" />;
  if (useError)
    return (
      <ErrorMessage
        message={useError.message}
        severity={"warning"}
        action={() => {
          setError(null);
        }}
      />
    );

  return (
    <List dense>
      {useFinishing.map((item, index) => (
        <ListItem key={index}>
          <Typography variant="h6">
            {`${item.Proceso} $${item.Costo.Valor}`}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default FinishingList;
