import React from "react";
import SimpleRadarChart from "./SimpleRadarChart";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { Box } from "@mui/material";

const JobsPerSellerPapyrus = (props) => {
  // Cantidad de vendedores a mostrar en el ranking
  const [useRank] = React.useState(props.rank || 10);

  let sellers = {};

  try {
    if (props.jobs) {
      for (let job of props.jobs) {
        // En SQL la propiedad es un string directo: job.Vendedor
        const nombreVendedor = job.Vendedor || "Sin Asignar";

        if (sellers[nombreVendedor]) {
          sellers[nombreVendedor].qJobs += 1;
        } else {
          sellers[nombreVendedor] = {
            name: nombreVendedor,
            qJobs: 1,
          };
        }
      }
    }

    // Ordenar de mayor a menor y aplicar el rank
    const topSellers = Object.values(sellers)
      .sort((a, b) => b.qJobs - a.qJobs)
      .slice(0, useRank);

    return (
      <SimpleRadarChart
        sx={{ width: "100%", height: "100%" }}
        data={topSellers}
        dataKey={{ cat: "name", qty: "qJobs" }}
        title={props.title || "Trabajos por vendedor (Papyrus)"}
      />
    );
  } catch (error) {
    return (
      <Box>
        <ErrorMessage
          message={"Hubo un error al cargar la información de vendedores"}
          severity={"error"}
          action={() => {
            if (props.setError) props.setError(error);
            else console.error(error);
          }}
        />
      </Box>
    );
  }
};

export default JobsPerSellerPapyrus;
