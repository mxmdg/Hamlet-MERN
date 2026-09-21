import React from "react";
import TopBarChart from "./TopBarChart";

const QuotationsAmountPerClient = (props) => {
  const rank = props.rank || 10;
  let customers = {};

  try {
    for (let quotation of props.jobs) {
      const id = quotation.customerId || "Cliente Eliminado";
      const name = quotation.customer || "Cliente Eliminado";

      if (customers[id]) {
        customers[id].total += quotation.total || 0;
      } else {
        customers[id] = { total: quotation.total || 0, name };
      }
    }
  } catch (error) {
    props.setError(error);
  }

  const data = Object.values(customers).map((c) => ({
    ...c,
    total: Math.round(c.total),
  }));

  return (
    <TopBarChart
      data={data}
      dataKey={{ cat: "name", qty: "total" }}
      title={"Monto Cotizado por Cliente ($)"}
      rank={rank}
      labelWidth={160}
    />
  );
};

export default QuotationsAmountPerClient;