import React from "react";
import SimpleRadarChart from "./SimpleRadarChart";

const QuotationsPerClient = (props) => {
  const rank = props.rank || 8;
  let customers = {};

  try {
    for (let quotation of props.jobs) {
      const id = quotation.customerId || "Cliente Eliminado";
      const name = quotation.customer || "Cliente Eliminado";

      if (customers[id]) {
        customers[id].qty += 1;
      } else {
        customers[id] = { qty: 1, name };
      }
    }
  } catch (error) {
    props.setError(error);
  }

  const topCustomers = Object.values(customers)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, rank);

  return (
    <SimpleRadarChart
      data={topCustomers}
      dataKey={{ cat: "name", qty: "qty" }}
      title={"Cotizaciones por Cliente"}
    />
  );
};

export default QuotationsPerClient;