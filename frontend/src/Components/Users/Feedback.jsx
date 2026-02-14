import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormMaterial from "../Formulario/FormMaterial";
import { Container } from "@mui/material";
import { addPrivateElement } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

const Feedback = (props) => {
  const [useColor, setColor] = React.useState(props.color || "primary");
  const [useVariant, setVariant] = React.useState(props.variant || "filled");
  const [useLoading, setLoading] = useState(false);
  const [useError, setError] = useState(null);
  const navigate = useNavigate();
  const feedbackDataForm = [
    {
      inputName: "name",
      label: "Nombre",
      type: "Text",
      id: "id_801",
      required: true,
    },
    {
      inputName: "lastName",
      label: "Apellido",
      type: "Text",
      id: "id_802",
      required: true,
    },
    {
      inputName: "company",
      label: "Empresa",
      type: "Text",
      id: "id_803",
      required: false,
    },
    {
      inputName: "email",
      label: "Email",
      type: "email",
      id: "id_804",
      required: true,
    },
    {
      inputName: "message",
      label: "Comentarios",
      type: "Textarea",
      id: "id_805",
      multiline: true,
      required: true,
    },
  ];

  const submitHandler = async (values) => {
    try {
      const res = await addPrivateElement("users/feedback", values);
      if (res) {
        setLoading(false);
        setError({
          title: "Gracias!",
          message: res.data,
          severity: "success",
          action: () => {
            setError(null);
            navigate(-1);
          },
        });
      }
    } catch (error) {
      setError({
        message: error.message,
        title: error.code,
        severity: "warning",
        action: () => setError(null),
      });
    }
  };

  if (useError) {
    return (
      <ErrorMessage
        message={useError.message}
        title={useError.title}
        severity={useError.severity}
        action={useError.action}
        color={useColor}
        variant={useVariant}
      />
    );
  }

  return (
    <Container height="100%" sx={{ margin: "auto" }}>
      <FormMaterial
        form={feedbackDataForm}
        collection={"users/feedback"}
        task="new"
        title="Envianos tus comentarios"
        subtitle="Nos estas ayudando a mejorar Hamlet"
        submitText="Enviar comentario"
        action={submitHandler}
      />
    </Container>
  );
};

export default Feedback;
