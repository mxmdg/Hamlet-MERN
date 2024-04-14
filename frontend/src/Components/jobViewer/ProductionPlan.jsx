import { useEffect, useState } from "react";

// Mui Material Imports
import Container from "@mui/material/Container";

// Mis componentes
import { objectToArray } from "../General/ObjectToArrayFilter";

const ProductionPlan = (props) => {
  const AllData = objectToArray(props.impositionData);

  console.log("AllData", AllData);

  return (
    <Container>
      {AllData.map((data) => {
        return (
          <div key={data.id}>
            <h3>{`Impresora: ${data.ImpositionData.printerSelector.Fabricante} ${data.ImpositionData.printerSelector.Modelo}`}</h3>
            <h3>{`Impresiones: ${data.impresiones}`}</h3>
            <h3>{`${data.totalPliegos} pliegos de ${data.stock.Marca} ${data.stock.Tipo} ${data.stock.Gramaje} ${data.stock.Ancho_Resma} x ${data.stock.Alto_Resma}`}</h3>
          </div>
        );
      })}
    </Container>
  );
};

export default ProductionPlan;
