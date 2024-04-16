import { useEffect, useState } from "react";

// Mui Material Imports
import Container from "@mui/material/Container";

// Mis componentes
import { objectToArray } from "../General/ObjectToArrayFilter";

const ProductionPlan = (props) => {
  const AllData = objectToArray(props.impositionData);
  console.log(props.impositionData)
  console.log(AllData)

  /* Modelo del datos:
  {
    "Poses": 4,
    "ImpositionData": {
        "printerSelector": {
            "_id": "65bbac3b822997b0e013e97d",
            "Modelo": "nuvera 157",
            "Fabricante": "xerox",
            "Colores": 1,
            "X_Minimo": 350,
            "X_Maximo": 470,
            "Y_Minimo": 203,
            "Y_Maximo": 320,
            "Paginas_por_minuto": 157,
            "Costo_impresion": 6,
            "Fecha": "2024-02-01T14:35:39.489Z",
            "__v": 0
        },
        "widthPage": "155",
        "heightPage": "225",
        "Calle": "0",
        "margenes": "0",
        "formatSelector": {
            "_id": "64232a930bf812f65f40c0a7",
            "Nombre": "470 x 320",
            "Ancho": 470,
            "Alto": 320,
            "__v": 0,
            "Superficie": "150400 mm2",
            "id": "64232a930bf812f65f40c0a7"
        },
        "widthSheet": 470,
        "heightSheet": 320
    },
    "totalPliegos": 5852,
    "totalHojas": 1463,
    "tirada": 38,
    "id": "66191f1a04c0f85b62c84867",
    "stock": {
        "_id": "6426d0743f8671de5c2439c4",
        "Nombre_Material": "obra 80",
        "Marca": "boreal",
        "Gramaje": 80,
        "Tipo": "obra",
        "Ancho_Resma": 950,
        "Alto_Resma": 650,
        "Espesor_Resma": 56,
        "Fibra": 950,
        "Precio_x_Kilo": 5,
        "Color": "blanco",
        "__v": 0
    },
    "impresiones": 11704
}
  */

const totalResume = (arr) => {
  const totals = {};

  arr.forEach((data) => {
    const { printerSelector, stock, formatSelector } = data.ImpositionData;
    const key = `${printerSelector.Fabricante} ${printerSelector.Modelo} - ${data.stock._id} - ${formatSelector._id} - ${data.stock._id}`;

    if (!totals[key]) {
      totals[key] = {
        printer: printerSelector,
        stock: data.stock,
        format: formatSelector,
        totalPliegos: 0,
        totalHojas: 0,
        impresiones: 0
      };
    }

    totals[key].totalPliegos += data.totalPliegos;
    totals[key].totalHojas += data.totalHojas;
    totals[key].impresiones += data.impresiones;
  });

  return Object.values(totals);
};



const resumen = (totalResume(AllData))

console.log(resumen)

  return (
    <Container>
      {/* {AllData.map((data) => {
        return (
          <div key={data.id}>
            <p>
              <h3>{`Impresora: ${data.ImpositionData.printerSelector.Fabricante} ${data.ImpositionData.printerSelector.Modelo}: `}</h3>
              {`Impresiones: ${data.impresiones},`}{" "}
              {`${data.totalPliegos} pliegos de ${data.stock.Marca} ${data.stock.Tipo} ${data.stock.Gramaje} gramos, ${data.ImpositionData.formatSelector.Ancho} x ${data.ImpositionData.formatSelector.Alto} mm.`}
            </p>
            <p>{`${data.totalHojas} Pliegos de la resma de ${data.stock.Ancho_Resma} x ${data.stock.Alto_Resma}`}</p>
          </div>
        );
      })} */}
      {resumen.map((data)=>{
        return (
          <div key={data.format._id + data.printer._id}>
            <p>
              <h3>{`Impresora: ${data.printer.Fabricante} ${data.printer.Modelo}: `}</h3>
              {`Impresiones: ${data.impresiones},`}{" "}
              {`${data.totalPliegos} pliegos de ${data.stock.Marca} ${data.stock.Tipo} ${data.stock.Gramaje} gramos, ${data.format.Ancho} x ${data.format.Alto} mm.`}
            </p>
            <p>{`${data.totalHojas} Pliegos de la resma de ${data.stock.Ancho_Resma} x ${data.stock.Alto_Resma}`}</p>
          </div>
        );
      })}
    </Container>
  );
};

export default ProductionPlan;
