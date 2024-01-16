import React, { useState } from "react";
import {
  Grid,
  FormControl,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Select as MuiSelect,
  MenuItem,
  InputLabel,
  Input,
  TextField,
  Button,
} from "@mui/material";

const FormMaker = ({ formData, collection, task }) => {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (e, id, type) => {
    let value = e.target.value;
    if (type === "number") {
      value = parseInt(value, 10);
    }

    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleCheckboxChange = (e, id) => {
    setFormValues((prevValues) => ({ ...prevValues, [id]: e.target.checked }));
  };

  const handleSelectChange = (e, id) => {
    setFormValues((prevValues) => ({ ...prevValues, [id]: e.target.value }));
  };

  const renderFormInputs = () => {
    return formData.map((field) => {
      const { inputName, type, id, options, required } = field;

      switch (type) {
        case "Text":
        case "email":
        case "number":
          return (
            <Grid item xs={12} key={id}>
              <TextField
                fullWidth
                label={inputName}
                type={type}
                id={id}
                required={required}
                onChange={(e) => handleInputChange(e, id, type)}
              />
            </Grid>
          );

        case "Select":
          return (
            <Grid item xs={12} key={id}>
              <FormControl fullWidth>
                <InputLabel id={`${id}-label`}>{inputName}</InputLabel>
                <MuiSelect
                  labelId={`${id}-label`}
                  id={id}
                  value={formValues[id] || ""}
                  onChange={(e) => handleSelectChange(e, id)}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.text}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Grid>
          );

        case "checkbox":
          return (
            <Grid item xs={12} key={id}>
              <FormControlLabel
                control={
                  <Checkbox
                    id={id}
                    checked={formValues[id] || false}
                    onChange={(e) => handleCheckboxChange(e, id)}
                  />
                }
                label={inputName}
              />
            </Grid>
          );

        default:
          return null;
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form values:", formValues);
    // Aquí puedes enviar los datos del formulario a tu lógica de manejo de datos, incluyendo collection y task
    console.log("Collection:", collection);
    console.log("Task:", task);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {renderFormInputs()}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Enviar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FormMaker;
