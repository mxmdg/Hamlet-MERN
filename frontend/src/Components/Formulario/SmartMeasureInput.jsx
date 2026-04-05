// Formulario/SmartMeasureInput.jsx
import React, { useState, useEffect, useContext } from "react";
import { TextField, InputAdornment } from "@mui/material";
// Ajustá este import a donde esté tu contexto realmente
import { AuthContext } from "../context/AuthContext";
import {
  parseMeasure,
  formatMeasure,
} from "../utils/generalData/unitConverter";

const SmartMeasureInput = ({
  value,
  onChange,
  subtype = "length",
  ...props
}) => {
  const auth = useContext(AuthContext);

  // LOG PARA CAZAR EL ERROR
  // console.log("--- DEBUG HAMLET ---");
  // console.log("Contexto Auth:", auth);
  // console.log("Membresía [0]:", auth?.memberships?.[0]);
  // console.log("Tenant:", auth?.memberships?.[0]?.tenant);

  // PRUEBA AMBAS POSIBILIDADES (con una 'n' y con dos 'n')
  const tenantUnits = auth?.memberships?.[0]?.tenant?.settings.units;

  //console.log("Unidades encontradas:", tenantUnits);

  const defaultUnit =
    subtype === "length"
      ? tenantUnits?.size || "mm"
      : tenantUnits?.weight || "g";

  // console.log("Unidad final aplicada:", defaultUnit);
  // console.log("---------------------");

  // 1. Obtenemos las preferencias de unidad de forma segura
  /* const tenantUnits = auth?.memberships?.[0]?.tenant?.units;
  const defaultUnit =
    subtype === "length"
      ? tenantUnits?.size || "mm"
      : tenantUnits?.weight || "g"; */

  // 2. Estado local para lo que el usuario ve y escribe en la pantalla
  const [localValue, setLocalValue] = useState("");

  // 3. Sincronizamos el valor de la BD (mm/g) con lo que se muestra
  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      const formatted = formatMeasure(value, subtype, defaultUnit);
      setLocalValue(formatted.toString());
    } else {
      setLocalValue("");
    }
  }, [value, subtype, defaultUnit]);

  // Permitimos que el usuario escriba fórmulas o letras sin que se rompa
  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = (e) => {
    const inputValue = e.target.value;

    if (!inputValue) {
      onChange(""); // Si lo borró todo, manda vacío
      if (props.onBlur) props.onBlur(e);
      return;
    }

    // A. Parseamos lo que escribió a la unidad base (mm o g) para guardar en la BD
    const valueInBaseUnit = parseMeasure(inputValue, subtype, defaultUnit);

    // B. Le pasamos el valor base (mm/g) al formulario (react-hook-form)
    onChange(valueInBaseUnit);

    // C. Formateamos de nuevo para limpiar el input (ej: si escribió "10+5", ahora mostrará "15")
    const formatted = formatMeasure(valueInBaseUnit, subtype, defaultUnit);
    setLocalValue(formatted.toString());

    if (props.onBlur) {
      props.onBlur(e); // Propaga el blur por si react-hook-form lo necesita
    }
  };

  return (
    <TextField
      {...props}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{defaultUnit}</InputAdornment>
        ),
      }}
    />
  );
};

export default SmartMeasureInput;
