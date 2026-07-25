// jobViewerV2/components/PartsList.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import PartCard from "./PartCard";

/**
 * Recibe el array de partes y lo recorre.
 * Cada parte se renderiza como un <PartCard /> real, con su key.
 */
const PartsList = ({ partes = [], impoData = {}, cantidad = 1 }) => {
  if (!Array.isArray(partes) || partes.length === 0) {
    return <Typography variant="body2">Este trabajo no tiene partes.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
        Partes
      </Typography>
      {partes.map((part, index) => (
        <PartCard
          key={part._id ?? index}
          part={part}
          index={index}
          total={partes.length}
          impoData={impoData[part._id] ?? null}
          cantidad={cantidad}
        />
      ))}
    </Box>
  );
};

export default PartsList;