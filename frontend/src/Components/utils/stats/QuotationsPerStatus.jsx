import React from "react";
import NewStackedBarChart from "./NewStackedBarChart";
import { getMyDate } from "../generalData/fechaDiccionario";

const STATUS_LIST = ["Pendiente", "Aprobado", "Rechazado", "Enviado"];

const QuotationsPerStatus = (props) => {
  let byMonth = {};

  try {
    for (let quotation of props.jobs) {
      const bucket = getMyDate(quotation.fecha).mmyy; // "mm/yyyy"
      const status = quotation.status || "Sin estado";

      if (!byMonth[bucket]) byMonth[bucket] = { name: bucket };
      byMonth[bucket][status] = (byMonth[bucket][status] || 0) + 1;
    }
  } catch (error) {
    props.setError(error);
  }

  const data = Object.values(byMonth).sort((a, b) => {
    const [mA, yA] = a.name.split("/");
    const [mB, yB] = b.name.split("/");
    return new Date(yA, mA - 1, 1) - new Date(yB, mB - 1, 1);
  });

  return (
    <NewStackedBarChart
      data={data}
      dataKey={STATUS_LIST}
      title={"Cotizaciones por Estado"}
      selectFrom={() => {}}
      selectTo={() => {}}
      route={props.route}
    />
  );
};

export default QuotationsPerStatus;