import React from "react";
import { useState } from "react";

import { TextField, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const TextFieldInput = (props) => {
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

  return (
    <>
      <TextField
        id={props.input.inputName}
        label={props.input.label || props.input.inputName}
        type={props.input.type}
        variant="outlined"
        value={props.itemData}
        name={props.input.inputName}
        /* {...register("Nombre", {
          required: true,
          minLength: 3,
          maxLength: 50,
        })}
        onBlur={() => {
          trigger("Nombre");
        }}
        fullWidth */
      />
      {errors.Nombre?.type === "minLength" && (
        <FormHelperText>
          Este campo debe tener al menos de 3 caracteres.
        </FormHelperText>
      )}
      {errors.Nombre?.type === "maxLength" && (
        <FormHelperText>
          Este campo debe tener menos de 50 caracteres.
        </FormHelperText>
      )}
      {errors.Nombre?.type === "required" && (
        <FormHelperText>Este campo es requerido</FormHelperText>
      )}
    </>
  );
};

export default TextFieldInput;
