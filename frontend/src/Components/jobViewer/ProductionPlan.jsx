import { useEffect, useState } from "react";

// Simulador de costos Papyrus - Imprenta Dorrego
import {
  Encuadernacion,
  Laminado,
  Nuvera,
  iGenBN,
  iGenColor,
} from "../Precioso/formSimulators";

// Mui Material Imports
import Container from "@mui/material/Container";

// Mis componentes
import { objectToArray } from "../General/ObjectToArrayFilter";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Mis Hooks
import { getPrivateElements } from "../customHooks/FetchDataHook";
import Spinner from "../General/Spinner";

const ProductionPlan = (props) => {
  const [usePrices, setPrices] = useState();
  const [useLoading, setLoading] = useState(false);
  const [useError, setError] = useState(null);
  const AllData = objectToArray(props.impositionData);
  console.log(props.impositionData);
  console.log(AllData);

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
      const cost = data.ImpositionData.printerSelector.Costo;

      if (!totals[key]) {
        totals[key] = {
          printer: printerSelector,
          stock: data.stock,
          format: formatSelector,
          totalPliegos: 0,
          totalHojas: 0,
          impresiones: 0,
        };
      }

      const printerCostFunction = (
        valor,
        minimo,
        cantidad,
        entrada,
        largoPliego
      ) => {
        if (
          printerSelector.Colores === 1 &&
          printerSelector.Modelo.includes("Nuvera")
        ) {
          console.log("Formula seleccionada segun caso Nuvera");
          return Nuvera(valor, minimo, cantidad, entrada, largoPliego);
        } else if (
          printerSelector.Colores === 1 &&
          !printerSelector.Modelo.includes("Nuvera")
        ) {
          console.log("Formula seleccionada segun caso iGenBN");
          return iGenBN(valor, minimo, cantidad, entrada, largoPliego);
        } else if (printerSelector.Colores === 4) {
          console.log("Formula seleccionada segun caso Color");
          return iGenColor(valor, minimo, cantidad, entrada, largoPliego);
        }
      };

      totals[key].totalPliegos += data.totalPliegos;
      totals[key].totalHojas += data.totalHojas;
      totals[key].impresiones += data.impresiones;
      totals[key].printPrice = printerCostFunction(
        cost.Valor,
        cost.Minimo,
        totals[key].impresiones,
        cost.Entrada,
        Math.max(totals[key].format.Alto, totals[key].format.Ancho)
      );
    });

    return Object.values(totals);
  };

  const resumen = totalResume(AllData);

  useEffect(() => {
    const fetchPrices = async () => {
      console.log("Cargando precios");
      try {
        setLoading(true); // Set loading state to true before fetching
        const priceList = await getPrivateElements("Precios");
        priceList.message ? setError(priceList.message) : setPrices(priceList);
        setLoading(false); // Set loading state to false after fetching
      } catch (error) {
        setLoading(false); // Set loading state to false if there's an error
        setError(error); // Set the error state if there's an error
      }
    };

    fetchPrices(); // Call the fetchPrices function inside useEffect

    // Make sure to include fetchPrices as a dependency array to avoid unnecessary re-renders
  }, []);

  const success = (
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
      {resumen.map((data) => {
        return (
          <div key={data.format._id + data.printer._id}>
            <h3>{`${data.printer.Fabricante} ${data.printer.Modelo} (${data.printer.Costo.Proceso}): `}</h3>
            <p>
              {`Impresiones: ${data.impresiones},`}{" "}
              {`${data.totalPliegos} pliegos de ${data.stock.Marca} ${data.stock.Tipo} ${data.stock.Gramaje} gramos, ${data.format.Ancho} x ${data.format.Alto} mm.`}
            </p>
            <ul>
              <li>
                Total: <b>{`$${data.printPrice.Total}`}</b>
              </li>
              <li>
                Unitario: <b>{`$${data.printPrice.Unitario}`}</b>
              </li>
            </ul>

            <p>{`${data.totalHojas} Pliegos de la resma de ${data.stock.Ancho_Resma} x ${data.stock.Alto_Resma}`}</p>
          </div>
        );
      })}
    </Container>
  );

  const failure = (
    <ErrorMessage
      message={useError}
      severity="error"
      action={() => setError(null)}
    />
  );

  const loading = <Spinner color="secondary" />;

  return useLoading ? loading : useError !== null ? failure : success;
};

export default ProductionPlan;
