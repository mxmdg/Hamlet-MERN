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
import { Grid } from "@mui/material";
import { Card, CardHeader, CardContent, CardActions } from "@mui/material";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";

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
          widthSheet: data.ImpositionData.widthSheet,
          heightSheet: data.ImpositionData.heightSheet,
          totalHojas: 0,
          impresiones: 0,
          sheetOriginalSize: data.ImpositionData.sheetOriginalSize,
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
          (printerSelector.Colores === 1 &&
            printerSelector.Modelo.includes("nuvera")) ||
          printerSelector.Modelo.includes("Nuvera")
        ) {
          console.log("Formula seleccionada segun caso Nuvera");
          return Nuvera(valor, minimo, cantidad, entrada, largoPliego);
        } else if (
          (printerSelector.Colores === 1 &&
            !printerSelector.Modelo.includes("nuvera")) ||
          (printerSelector.Colores === 1 &&
            !printerSelector.Modelo.includes("Nuvera"))
        ) {
          console.log("Formula seleccionada segun caso iGenBN");
          return iGenBN(valor, minimo, cantidad, entrada, largoPliego);
        } else if (printerSelector.Colores === 4) {
          console.log("Formula seleccionada segun caso Color");
          return iGenColor(valor, minimo, cantidad, entrada, largoPliego);
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

        console.log(paperPrice);

        const surface =
          parseFloat(data.stock.Ancho_Resma) *
          parseFloat(data.stock.Alto_Resma);
        const totalPaper = parseFloat(totalHojas) * surface;
        const weight = (totalPaper / 1000000) * parseFloat(data.stock.Gramaje);
        const cost = Math.ceil((weight / 1000) * parseFloat(paperPrice));

        console.log(surface, totalPaper, "Peso " + weight, cost);
        return { surface, totalPaper, weight, cost };
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
      totals[key].stockCost = stockCost(totals[key].totalHojas);
    });

    return Object.values(totals);
  };

  const resumen = totalResume(AllData);
  console.log(resumen);

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
  }, [setPrices]);

  const success = (
    <Grid container columns={12} spacing={2} padding={2}>
      {resumen.map((data) => {
        console.log("Data");
        console.log(data);
        return (
          <Grid item xs={12} sm={6} lg={3} key={data.printer._id + data.stock._id + resumen.indexOf(data)}>
            <Card
              
              elevation={8}
            >
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
                    <ListItemText
                      primary={`${data.impresiones}`}
                      secondary={"Impresiones"}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontSize: 12,
                      }}
                      primaryTypographyProps={{ variant: "h3", fontSize: 16 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${data.totalPliegos} `}
                      secondary={"Pliegos"}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontSize: 12,
                      }}
                      primaryTypographyProps={{ variant: "h3", fontSize: 16 }}
                    />
                  </ListItem>
                  <Divider />

                  <ListItem alignItems="flex-start">
                    <ListItemText
                      secondary={`${data.stock.Tipo} ${data.stock.Gramaje} gramos`}
                      primary={`${data.sheetOriginalSize?.width} x ${data.sheetOriginalSize?.height} mm.`}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontSize: 12,
                      }}
                      primaryTypographyProps={{ variant: "h3", fontSize: 16 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`$ ${data.printPrice.Unitario}`}
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
                    <ListItemText
                      secondary={"Costo final impreiones"}
                      primary={`$ ${Math.ceil(data.printPrice.Total)}`}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontSize: 12,
                      }}
                      primaryTypographyProps={{ variant: "h3", fontSize: 16 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`$ ${data.stockCost.cost}.-`}
                      secondary={`${data.totalHojas} Pliegos de ${data.stock.Ancho_Resma} x ${data.stock.Alto_Resma} mm.`}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontSize: 12,
                      }}
                      primaryTypographyProps={{ variant: "h3", fontSize: 16 }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`$ ${Math.ceil(
                        data.printPrice.Total + data.stockCost.cost
                      )} -`}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        fontSize: 16,
                        color: "primary",
                      }}
                      secondary={`Total`}
                      secondaryTypographyProps={{
                        variant: "subtitle2",
                        fontSize: 14,
                      }}
                    />
                  </ListItem>
                  <Divider />
                </List>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      
      {/* 
      
      Proximamente: agregar calculos de terminacion para el trabajo.
      
      <Grid item xs={12} sm={6} lg={3} key={"general"}>
            <Card
              
              elevation={8}
            >
              <CardHeader
                title={`${props.job.Nombre}`}
                titleTypographyProps={{ color: "primary" }}
                subheader={`${props.job.Tipo[0].name}`}
                subheaderTypographyProps={{ color: "secondary" }}
              ></CardHeader>
              <Divider />
              <CardContent>
                { {usePrices.map((price)=>{
                  <Typography key={price._id}>
                    {price.Proceso} {price.Valor}
                  </Typography>
                })} }
              </CardContent>
            </Card>
          </Grid> */}
    </Grid>
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
