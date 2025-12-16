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
import { Button, Grid } from "@mui/material";
import { Card, CardHeader, CardContent, CardActions } from "@mui/material";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";

// Mis componentes
import { objectToArray } from "../General/ObjectToArrayFilter";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {
  roundCents,
  roundInteger,
} from "../utils/generalData/numbersAndCurrencies";
import ListItemNumbers from "./ListItemNumbers";
import FinishingList from "./FinishingList";
import ProductionQuote from "./ProductionQuote";
import {
  currencyFormat,
  spanishFormat,
} from "../utils/generalData/numbersAndCurrencies";
import {
  addPrivateElement,
  getPrivateElementByID,
} from "../customHooks/FetchDataHook";

// Mis Hooks
import { getPrivateElements } from "../customHooks/FetchDataHook";
import Spinner from "../General/Spinner";

const ProductionPlan = (props) => {
  const [usePrices, setPrices] = useState();
  const [useLoading, setLoading] = useState(false);
  const [useError, setError] = useState(null);
  const [useQuoteSettings, setQuoteSettings] = useState(null);
  const AllData = objectToArray(props.impositionData);

  /* Modelo del datos:
  {
    "Poses": 4,
    "impositionData": {
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

    arr.forEach((data, index) => {
      console.log("Data: ", data);
      const { printerSelector, stock, formatSelector } = data.impositionData;
      const key = `${printerSelector.Fabricante} ${printerSelector.Modelo} - ${data.stock._id} - ${formatSelector._id} - ${data.stock._id}`;
      const cost = data.impositionData.printerSelector.Costo;

      if (!totals[key]) {
        totals[key] = {
          printer: printerSelector,
          stock: data.stock,
          format: formatSelector,
          totalPliegos: 0,
          widthSheet: data.impositionData.widthSheet,
          heightSheet: data.impositionData.heightSheet,
          totalHojas: 0,
          impresiones: 0,
          sheetOriginalSize: data.impositionData.sheetOriginalSize,
        };
      }

      const printerCostFunction = (
        valor,
        minimo,
        cantidad,
        entrada,
        largoPliego
      ) => {
        largoPliego = Math.max(
          parseInt(totals[key].sheetOriginalSize.width),
          parseInt(totals[key].sheetOriginalSize.height)
        );
        try {
          if (printerSelector.Colores === 1 && data.colores === 1) {
            console.log("Formula seleccionada segun caso Nuvera");
            console.log(printerSelector.Colores, data.colores);
            return Nuvera(valor, minimo, cantidad, entrada, largoPliego);
          } else if (printerSelector.Colores >= 4 && data.colores === 1) {
            console.log("Formula seleccionada segun caso iGenBN");
            console.log(printerSelector.Colores, data.colores);
            return iGenBN(valor, minimo, cantidad, entrada, largoPliego);
          } else if (
            printerSelector.Colores >= 4 &&
            data.colores > 1 &&
            data.colores <= 4
          ) {
            console.log("Formula seleccionada segun caso Color");
            console.log(printerSelector.Colores, data.colores);
            return iGenColor(valor, minimo, cantidad, entrada, largoPliego);
          } else if (printerSelector.Colores > 4 && data.colores > 4) {
            console.log("Formula seleccionada segun caso 6 colores");
            console.log(printerSelector.Colores, data.colores);
            return iGenColor(
              valor * 1.3,
              minimo,
              cantidad,
              entrada,
              largoPliego
            );
          } else {
            console.log("Caso no contemplado");
            return () => {
              return {
                Unitario: 1,
                Cantidad: 1,
                Total: 1,
                Papyrus: "",
                Formula: "No definido",
              };
            };
          }
        } catch (error) {
          setError(error);
        }
      };

      const stockCost = (totalHojas) => {
        let paperPrice;

        for (let i = 0; i < usePrices?.length; i++) {
          if (usePrices[i]._id === data.stock.Precio_x_Kilo) {
            paperPrice = usePrices[i].Valor;
            break;
          }
        }

        const surface =
          parseFloat(data.stock.Ancho_Resma) *
          parseFloat(data.stock.Alto_Resma);
        const totalPaper = parseFloat(totalHojas) * surface;
        const weight = (totalPaper / 1000000) * parseFloat(data.stock.Gramaje);
        const cost = Math.ceil((weight / 1000) * parseFloat(paperPrice));

        return { surface, totalPaper, weight, cost };
      };

      totals[key].key = key;
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
      totals[key].stockCost = stockCost(totals[key].totalHojas);
      totals[key].FinishingCost = props.partFinishingData[index].finishingData;
    });

    // Costo total:
    try {
      const prodsets = Object.getOwnPropertyNames(totals);
      let totalCost = {
        print: 0,
        stock: 0,
        finishing: props.totalFinishingCosts || 0,
      };
      for (let set of prodsets) {
        totalCost.print += totals[set].printPrice.Total;
        totalCost.stock += totals[set].stockCost.cost;
        //totalCost.finishing += totals[set].FinishingCost;
      }
      totals.totalCost = totalCost;
    } catch (error) {
      console.log(error);
      setError(error);
    }

    return Object.values(totals);
  };

  const resumen = totalResume(AllData);

  console.log("Resumen: ", resumen);

  const handleSaveProductionPlan = async (resumen) => {
    const data = {
      impositionData: props.impositionData,
      resumen: resumen,
      quoteSettings: useQuoteSettings,
      partsFinishing: props.partFinishingData,
      finishing: props.finishingData,
    };
    try {
      await addPrivateElement("quotations", {
        name: props.job.Nombre,
        customer: props.job.Company.Nombre,
        quantity: props.job.Cantidad,
        gain: useQuoteSettings?.quote?.gain || 0,
        comission: useQuoteSettings?.quote?.salesCommission || 0,
        taxes: useQuoteSettings?.quote?.iva || 0,
        total: useQuoteSettings?.quote?.total || 0,
        cost: Math.ceil(
          parseFloat(
            resumen[resumen.length - 1].print +
              resumen[resumen.length - 1].stock +
              resumen[resumen.length - 1].finishing
          )
        ),
        data,
        jobType: props.job.Tipo[0].name,
        owner: props.job.Owner._id,
        jobId: props.job._id,
        customerId: props.job.Company._id,
      });
      setError({
        title: "Presupuesto guardado",
        message: "Presupuesto guardado correctamente",
        severity: "success",
        action: () => setError(null),
      });
    } catch (error) {
      console.log("Error en ProductionPlan guardando presupuesto");
      console.log(error);
      setError({
        title: "Error guardando presupuesto",
        message: error.response.data.message || "Error inesperado",
        severity: "warning",
        action: () => setError(null),
      });
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
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
  }, [setPrices]);

  const success = (
    <Grid container columns={12} spacing={2} padding={2}>
      {resumen.slice(0, resumen.length - 1).map((data) => {
        return (
          <Grid
            item
            xs={12}
            sm={6}
            lg={3}
            key={data.printer._id + data.stock._id + resumen.indexOf(data)}
          >
            <Card elevation={8}>
              <CardHeader
                title={`${data.printer.Fabricante} ${data.printer.Modelo}`}
                titleTypographyProps={{ color: "primary" }}
                subheader={`(${data.printer.Costo.Proceso})`}
                subheaderTypographyProps={{ color: "secondary" }}
              ></CardHeader>
              <Divider />
              <CardContent>
                <List dense>
                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      primary={`${spanishFormat(data.impresiones)}`}
                      secondary={"Impresiones"}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      primary={`${spanishFormat(data.totalPliegos)} `}
                      secondary={"Pliegos"}
                    />
                  </ListItem>
                  <Divider />

                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      secondary={`${data.stock.Tipo} ${data.stock.Gramaje} gramos`}
                      primary={`${data.sheetOriginalSize?.width} x ${data.sheetOriginalSize?.height} mm.`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      primary={`${currencyFormat(data.printPrice.Unitario)}`}
                      secondary={"Unitario"}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontSize: 12,
                      }}
                      primaryTypographyProps={{ variant: "h3", fontSize: 16 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      secondary={"Costo final impreiones"}
                      primary={`${currencyFormat(
                        Math.ceil(data.printPrice.Total)
                      )}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      primary={`${currencyFormat(data.stockCost.cost)}`}
                      secondary={`${data.totalHojas} Pliegos de ${data.stock.Ancho_Resma} x ${data.stock.Alto_Resma} mm.`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      primary={`${currencyFormat(
                        roundInteger(data.FinishingCost)
                      )}`}
                      secondary={`Costo Terminacion`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemNumbers
                      primary={`${currencyFormat(
                        roundInteger(
                          data.printPrice.Total +
                            data.stockCost.cost +
                            data.FinishingCost
                        )
                      )}`}
                      secondary={`Total`}
                    />
                  </ListItem>
                  <Divider />
                </List>
              </CardContent>
            </Card>
          </Grid>
        );
      })}

      <Grid item xs={12} sm={6} lg={3} key={"general"}>
        <Card elevation={8}>
          <CardHeader
            title={`${props.job.Nombre}`}
            titleTypographyProps={{ color: "primary" }}
            subheader={`${props.job.Tipo[0].name}`}
            subheaderTypographyProps={{ color: "secondary" }}
          ></CardHeader>
          <Divider />
          <CardContent>
            <List>
              <ListItemNumbers
                primary={`${currencyFormat(resumen[resumen.length - 1].print)}`}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: 16,
                  color: "primary",
                  align: "right",
                }}
                secondary={`Impresion total`}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: 14,
                  align: "right",
                }}
              />
              <ListItemNumbers
                primary={`${currencyFormat(resumen[resumen.length - 1].stock)}`}
                secondary={`Material total`}
              />
              <ListItemNumbers
                primary={`${currencyFormat(props.finishingData)}`}
                secondary={`Terminacion trabajo final`}
              />
              <ListItemNumbers
                primary={`${currencyFormat(props.totalFinishingCosts)}`}
                secondary={`Terminacion total`}
              />
              <Divider />
              <ListItemNumbers
                primary={`${currencyFormat(
                  resumen[resumen.length - 1].print +
                    resumen[resumen.length - 1].stock +
                    props.totalFinishingCosts
                )}`}
                secondary={` Costo total`}
              />
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={3} key={"ProductionQuote"}>
        <Card elevation={8}>
          <CardHeader
            title={`Presupuesto`}
            titleTypographyProps={{ color: "primary" }}
            subheader={`Precio a pasar al cliente`}
            subheaderTypographyProps={{ color: "secondary" }}
          ></CardHeader>
          <Divider />
          <CardContent>
            <ProductionQuote
              costResume={{
                Print: roundInteger(resumen[resumen.length - 1].print),
                Stock: roundInteger(resumen[resumen.length - 1].stock),
                Finishing: roundInteger(props.totalFinishingCosts),
              }}
              quoteOptions={props.quoteOptions}
              job={props.job._id}
              quoteSettings={setQuoteSettings}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={parseFloat(useQuoteSettings?.gainPercentage) < 35}
              onClick={() => {
                handleSaveProductionPlan(resumen);
              }}
            >
              Guardar Presupuesto
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const failure = (
    <ErrorMessage
      title={useError?.title || null}
      message={useError?.message || "Error al cargar los datos"}
      severity={useError?.severity || "error"}
      action={useError?.action || (() => setError(null))}
    />
  );

  const loading = <Spinner color="secondary" />;

  return useLoading ? loading : useError !== null ? failure : success;
};

export default ProductionPlan;
