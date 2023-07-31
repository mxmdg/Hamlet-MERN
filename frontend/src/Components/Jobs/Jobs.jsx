import { useState, useEffect } from "react";
import axios from "axios";
import { getElement } from "../General/DBServices";
import JobParts from "./JobsParts";
import AddPartForm from "./AddPartForm";
import { fechtData } from "../customHooks/FetchDataHook";

const Jobs = () => {
  const [usePrinters, setPrinters] = useState([]);
  const [useStocks, setStocks] = useState([]);
  const [useFormats, setFormats] = useState([]);
  const [usePart, setPart] = useState([]);
  const [usePrecios, setPrecios] = useState([]);
  const [useOrderNumber, setOrderNumber] = useState(0);
  const [useCustomer, setCustomer] = useState("Maximilano Maro");
  const [useJob, setJob] = useState({});

  useEffect(() => {
    fechtData("impresoras", setPrinters);
    fechtData("materiales", setStocks);
    fechtData("formatos", setFormats);
    fechtData("precios", setPrecios);
    sortFormats();
    console.log(usePart);
    console.log(useStocks);
  }, [usePart, setOrderNumber]);

  const sortFormats = () => {
    const formatsSorted = useFormats.sort((a, b) => {
      if (a.Nombre < b.Nombre) return -1;
      if (a.Nombre > b.Nombre) return 1;
      return 0;
    });
    return formatsSorted;
  };

  const submitJobForm = (e) => {
    e.preventDefault();
    setOrderNumber(useOrderNumber + 1);
    console.log(e.target);
  };

  return (
    <div className="formulario">
      <h3>Nuevo Trabajo:</h3>
      <form action="newJob" onSubmit={submitJobForm}>
        <fieldset className="fieldset">
          <legend className="legend">informacion administrativa</legend>
          <div>
            <label htmlFor="order">Nº de Orden</label>
            <input
              type="number"
              name="order"
              defaultValue={useOrderNumber}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="customer">Cliente</label>
            <input
              type="text"
              name="customer"
              placeholder="Cliente"
              readOnly
              value={useCustomer}
            />
          </div>
          <div>
            <label htmlFor="jobName">Nomnre del trabajo</label>
            <input
              type="text"
              name="jobName"
              placeholder="Nombre del trabajo"
            />
          </div>
        </fieldset>
        {/* {useStocks.length > 0 ? (
          <AddPartForm
            stocks={useStocks}
            onChange={setPart}
            partDefinition={usePart}
          />
        ) : (
          <></>
        )} */}
        <div>
          <button type="submit">Enviar</button>
        </div>
      </form>

      {/* <select>
        {usePrinters.map((printer) => (
          <option key={printer._id}>
            {printer.Fabricante} {printer.Modelo}
          </option>
        ))}
      </select>
      <h3>Materiales:</h3>
      <select onChange={(e) => console.log(e.target.value)}>
        {useStocks.map((stock) => (
          <option key={stock._id} value={stock}>
            {stock.Nombre_Material} {stock.Tipo} {stock.Gramaje}
          </option>
        ))}
      </select>
      <h3>Formatos:</h3>
      <select>
        {sortFormats().map((format) => (
          <option key={format._id}>{format.Nombre}</option>
        ))}
      </select>
      <h3>Formatos:</h3>
      <select>
        {usePrecios.map((format) => (
          <option key={format._id}>
            {format.Proceso} ${format.Valor}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default Jobs;
