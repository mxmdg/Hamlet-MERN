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
            <p>
              <h3>{`Impresora: ${data.ImpositionData.printerSelector.Fabricante} ${data.ImpositionData.printerSelector.Modelo}: `}</h3>
              {`Impresiones: ${data.impresiones},`}{" "}
              {`${data.totalPliegos} pliegos de ${data.stock.Marca} ${data.stock.Tipo} ${data.stock.Gramaje} gramos, ${data.ImpositionData.formatSelector.Ancho} x ${data.ImpositionData.formatSelector.Alto} mm.`}
            </p>
          </div>
        );
      })}
    </Container>
  );
};

export default ProductionPlan;
