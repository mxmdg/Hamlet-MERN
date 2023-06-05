import React, { useEffect, useState } from "react";
import axios from "axios";

const Reader = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/hamlet/${props.collection}`
        );
        setData(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [props.collection]);

  if (!data) {
    return <h1>Loading...</h1>;
  } else {
    return <div>Hay data...</div>;
  }

  /* return (
    <div>
      {data.map(data => <h6>{data[0]}</h6>)}
      <p>{data.map(data => data.length)}</p>
    </div>
  ); */
};

export default Reader;
