import React, { useState, useEffect } from "react";
import NewRadialBar from "./NewRadialBar";
import SimpleRadarChart from "./SimpleRadarChart";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const JobsPerType = (props) => {
  const [useRank, setRank] = useState(6);
  const [useError, setError] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    let products = {};

    try {
      for (let job of props.jobs) {
        if (products[job.Tipo[0].name]) {
          products[job.Tipo[0].name].qJobs >= 1
            ? (products[job.Tipo[0].name].qJobs += 1)
            : (products[job.Tipo[0].name].qJobs = 1);
        } else {
          products[job.Tipo[0].name] = {
            qJobs: 1,
            name: `${job.Tipo[0].name}`,
          };
        }
      }

      const sortedProducts = Object.values(products)
        .sort((a, b) => a.qJobs - b.qJobs)
        .slice(-useRank);
      setTopProducts(sortedProducts);
    } catch (error) {
      setError(error);
    }
  }, [props.jobs, useRank]);

  const success = (
    <SimpleRadarChart
      data={topProducts}
      dataKey={{ cat: "name", qty: "qJobs" }}
      title={"Trabajos por tipo"}
    />
  );
  const errorComponent = (
    <ErrorMessage
      message={"Error recopilando los datos"}
      action={() => setError(null)}
    />
  );

  return useError === null ? success : errorComponent;
};

export default JobsPerType;
