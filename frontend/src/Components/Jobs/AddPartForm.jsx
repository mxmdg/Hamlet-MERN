import JobParts from "./JobsParts";
import { useState, useEffect } from "react";

const AddPartForm = (props) => {
  const defaultPart = ["Tapa", 1, 2, "simplex", "duplex", 170, 350];
  //console.log(props.stocks)
  const [usePartDefinition, setPartDefinition] = useState([defaultPart]);
  const [useSelectedStock, setSelectedStock] = useState("");

  useEffect(() => {
    try {
      setPartDefinition(props.partDefinition.split(","));
      console.log(usePartDefinition);
    } catch (e) {
      console.log(e);
    }
  }, [props.partDefinition, props.stocks]);

  return (
    <>
      <fieldset className="fieldset">
        <legend className="legend">Parte</legend>
        <JobParts onChange={props.onChange} />
        <div>
          <label htmlFor="pages">Páginas</label>
          <input
            type="number"
            name="pages"
            max={usePartDefinition[2]}
            min={usePartDefinition[1]}
          />
        </div>
        <div>
          <label htmlFor="frontColors">Colores Frente</label>
          <select name="frontColors" id="frontColors">
            <option value="0">Sin impresion</option>
            <option value="1">Negro</option>
            <option value="4">CMYK</option>
          </select>
          <label htmlFor="backColors">Colores Dorso</label>
          <select
            name="backColors"
            id="backColors"
            disabled={!usePartDefinition.includes("duplex")}
          >
            <option value="0">Sin impresion</option>
            <option value="1">Negro</option>
            <option value="4">CMYK</option>
          </select>
        </div>
        <div>
          <label htmlFor="stockSelector">
            Material{" "}
            {useSelectedStock !== ""
              ? `: ${useSelectedStock}`
              : `: selecciar material`}
          </label>
          <select
            name="stockSelector"
            onChange={(e) => setSelectedStock(e.value)}
          >
            {props.stocks.map((stock) => {
              if (
                stock.Gramaje >
                  usePartDefinition[usePartDefinition.length - 2] &&
                stock.Gramaje < usePartDefinition[usePartDefinition.length - 1]
              ) {
                return (
                  <option key={stock._id}>
                    {stock.Nombre_Material} {stock.Marca} {stock.Tipo}{" "}
                    {stock.Gramaje}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div>
          <label htmlFor="ancho">Ancho (mm)</label>
          <input type="number" name="ancho" />
          <br />
          <label htmlFor="alto">Alto (mm)</label>
          <input type="number" name="alto" />
        </div>
      </fieldset>
    </>
  );
};

export default AddPartForm;
