import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Box,
  Grid,
  Divider,
  Typography,
  List,
  ListItem,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  getPrivateElementByID,
  putPrivateElement,
  addPrivateElement,
} from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

// My inputs imports
import TextFieldInput from "./TextFieldInput";

//Auxiliar Functions:

function convertirArrayAObjeto(arr) {
  return arr.reduce((obj, item) => {
    const propName =
      item.nombre || item.Nombre_material || item.Modelo || item.Proceso;
    const propValue = isNaN(item.value)
      ? typeof item.value !== String
        ? item.value
        : item.value.toLowerCase()
      : Number(item.value);

    obj[propName] = propValue;

    return obj;
  }, {});
}

const FormMaker = (props) => {
  //Loading state
  const [useLoading, setLoading] = useState(false);

  // Error state manager
  const [useError, setError] = useState(null);
  const resetError = () => {
    setError(null);
  };

  // Item state manager
  const [useItem, setItem] = useState(null);
  const itemID = useParams("_id");

  const getItem = async () => {
    try {
      setLoading(true);
      const res = await getPrivateElementByID(props.collection, itemID.id);
      setItem(res);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  //React Hook Form implementation
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    mode: "onChange", //"onBlur"
  });

  // useEffect
  useEffect(() => {
    if (props.task !== "new") {
      getItem();
    }
  }, []);

  // Renders
  const testRender = (
    <Container>
      <Box component={"div"} sx={{ background: "#333", padding: 3 }}>
        <Typography variant="h5" color="primary">
          Coleccion: <b>{props.collection}</b>
        </Typography>
        <br />
        <Typography variant="h5" color="primary">
          Accion: <b>{props.task}</b>
        </Typography>
        {props.form.map((item) => {
          return (
            <>
              <List key={item.id + item.inputName}>
                <ListItem>
                  <Typography
                    color="primary"
                    variant="caption"
                    fontSize={"16px"}
                  >
                    {item.inputName}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography
                    color="primary"
                    variant="caption"
                    fontSize={"16px"}
                  >
                    {item.inputLabel}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography
                    color="primary"
                    variant="caption"
                    fontSize={"16px"}
                  >
                    {item.type}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography
                    color="primary"
                    variant="caption"
                    fontSize={"16px"}
                  >
                    {item.id}
                  </Typography>
                </ListItem>
              </List>
              <Divider></Divider>
            </>
          );
        })}
        {useItem !== null ? (
          <p>{JSON.stringify(useItem.data)}</p>
        ) : (
          <p>{useError?.message}</p>
        )}
      </Box>
    </Container>
  );

  // Form Render
  const formRender = (
    <Container>
      <Grid container columns={12} spacing={2}>
        {props.form.map((input) => {
          return (
            <Grid key={input.id} size={{ sm: 12, md: 6, lg: 4 }}>
              {useItem !== null && (
                <TextFieldInput
                  input={input}
                  itemData={useItem.data[input.inputName]}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );

  const loadingRender = <Spinner />;

  const errorRender = (
    <ErrorMessage message={useError} severity="error" action={resetError} />
  );

  return useLoading
    ? loadingRender
    : useError !== null
    ? errorRender
    : formRender;
};

export default FormMaker;
