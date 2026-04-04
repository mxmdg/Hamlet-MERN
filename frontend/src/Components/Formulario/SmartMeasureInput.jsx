import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { parseMeasure } from "../utils/generalData/unitConverter";

const SmartMeasureInput = ({ value, onChange, subtype, ...props }) => {
  // Estado local para que el usuario pueda escribir "10cm" sin que
  // el input se lo borre instantáneamente mientras escribe.
  const [localValue, setLocalValue] = useState(value);

  // Si el valor externo cambia (ej. se carga un formulario), actualizamos el local
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = (e) => {
    const inputValue = e.target.value;
    const converted = parseMeasure(inputValue, subtype);

    // Actualizamos el estado de React Hook Form con el número puro (mm)
    onChange(converted);

    // Opcional: Actualizamos el visual para que el usuario vea que se convirtió
    // Ej: si escribió "1in", al salir verá "25.4"
    setLocalValue(converted);
  };

  return (
    <TextField
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      // Cambiamos a type text para que acepte letras de unidades
      type="text"
      {...(subtype && {slotProps:{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {subtype == "weight" ? "g" : "mm"}
            </InputAdornment>
          ),
        },
      }})}
    />
  );
};

export default SmartMeasureInput;
