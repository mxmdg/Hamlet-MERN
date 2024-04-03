import React, { useState, useContext } from "react";
import { themeOptions } from "../theme"; // Asegúrate de importar el contexto del tema aquí
import { Box, Grid, Typography } from "@mui/material"; // Importa los componentes de MUI Material

const ColorPalette = () => {
  //const { themeOptions } = useContext(ThemeContext); // Utiliza el contexto del tema para acceder a las opciones del tema
  const [selectedColor, setSelectedColor] = useState("");

  const handleColorChange = (color) => {
    setSelectedColor(color);
    // Aquí puedes manejar el cambio de color, por ejemplo, cambiando el tema

    console.log(`Color seleccionado: ${color}`);
  };

  return (
    <Box>
      {Object.keys(themeOptions.palette).map((color) => (
        <Box key={color} marginBottom={2}>
          <Typography variant="title">{color}</Typography>
          <Grid container spacing={1}>
            {Object.keys(themeOptions.palette[color]).map((variant) => (
              <Grid item key={variant} xs={6} sm={4} md={3} lg={2}>
                <input
                  type="color"
                  value={themeOptions.palette[color][variant]}
                  onClick={() => handleColorChange(`${color}-${variant}`)}
                />
                <Typography variant="body2" color="textPrimary">
                  {themeOptions.palette[color][variant]}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default ColorPalette;
