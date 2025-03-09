import React from "react";
import { useEffect, useState } from "react";

import { List, ListItem, ListItemText } from "@mui/material";

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
          if (typeof props.finishing[0] === "object") {
            setFinishing(props.finishing);
          } else {
            const finisherList = [];
            for (const finisher of props.finishing) {
              const finishing = await getPrivateElementByID(
                "finishers",
                finisher
              );
              finisherList.push(finishing.data);
            }
            setFinishing(finisherList);
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
          <ListItemText
            primary={`${item.Proceso} ${item.Costo.Valor}`}
            secondary={item.Fabricante}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default FinishingList;
