import "../../Styles/hamlet.css";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "./Modal";
import Historial from "./Historial";
import Simulator from "./Simulator";
import LastSeen from "./LastUpdate";
import { useNavigate } from "react-router-dom";
import MyLineChart from "./LineChart";
import SimpleAreaChart from "../utils/stats/SimpleAreaChart";
import {
  getPrivateElements,
  deletePrivateElement,
} from "../customHooks/FetchDataHook";
import Spinner from "../General/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {
  currencyFormat,
  spanishFormat,
} from "../utils/generalData/numbersAndCurrencies";
import { fillMonthlyData } from "../utils/generalData/fillMonthlyData";

const PriceTable = (props) => {
  const [isThereHistory, setIsThereHistory] = useState();
  const [showHistory, setShowHistory] = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [useLoading, setLoading] = useState(false);
  const [useError, setError] = useState(false);
  const navigate = useNavigate();

  const getElements = async () => {
    try {
      const items = await getPrivateElements(`${props.collection}/`);
      setLoading(false);
      return items;
    } catch (error) {
      setError(true);
      setLoading(false);
      return error;
    }
  };

  const deleteClickHandler = async (id) => {
    if (
      window.confirm(
        `Estas recontra seguro de borrar ${
          props.pd.Nombre ||
          props.pd.Nombre_Material ||
          props.pd.Modelo ||
          props.pd.Proceso
        }`
      )
    ) {
      try {
        await deletePrivateElement(props.collection, id);
        getElements();
        props.editor(true);
        setLoading(false);
      } catch (e) {
        alert(e.response.data.message);
      }
    }
  };

  const checkHistory = () => {
    if (props.pd.Historial.length === 0) {
      setIsThereHistory(false);
    } else {
      setIsThereHistory(true);
    }
  };

  const handleHistory = () => {
    try {
      if (props.pd.Historial.length === 0) {
        setShowHistory(false);
        alert("No hay datos en el historial");
      } else {
        setShowHistory(true);
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const handleSim = () => {
    setShowSim(true);
  };

  useEffect(() => {
    checkHistory();
  }, []);

  const viewer = (
    <>
      <Card
        sx={{
          minHeight: 400,
          width: "100%",
        }}
        direction="column"
        color="secondary"
        elevation={6}
      >
        <CardHeader title={props.pd.Proceso} subheader={props.pd.Categoria} />
        <CardContent
          sx={{
            maxWidth: "100%",
            minHeight: 400,
            height: "100%",
          }}
        >
          <Typography
            gutterBottom
            variant="p"
            color="text.secondary"
            component="p"
          >
            <LastSeen date={props.pd.Fecha} />
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table
              sx={{ maxWidth: 350 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">Proceso</TableCell>
                  <TableCell align="left">Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(props.formCLC)?.map(([key, value]) => (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" align="left">
                      {key}
                    </TableCell>
                    <TableCell align="left">
                      {key === "formula" ? (
                        <Modal
                          btnText={`ver ${key}`}
                          modalTitle={`${props.pd.Proceso} ${key}`}
                          modalText={value}
                        />
                      ) : key === "valor" ? (
                        `${value} (u$d ${(value / props.cotization).toFixed(
                          4
                        )})`
                      ) : (
                        value
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {isThereHistory && (
            <SimpleAreaChart
              data={fillMonthlyData(props.pd.Historial)}
              dataKey={["Fecha", "Valor", "Entrada", "Minimo"]}
            />
          )}
        </CardContent>

        <CardActions
          sx={{
            marginTop: "auto",
            marginBottom: "15px",
            alignContent: "center",
          }}
        >
          <ButtonGroup
            variant="text"
            aria-label="text button group"
            size="small"
          >
            <Button
              color="info"
              onClick={handleHistory}
              {...(isThereHistory ? "" : { disabled: true })}
            >
              Historial
            </Button>
            <Button
              color="info"
              onClick={() => {
                navigate(`/${props.collection}/edit/${props.id}`);
              }}
            >
              Editar
            </Button>
            <Button color="info" onClick={handleSim}>
              Simular
            </Button>
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteClickHandler(props.id)}
            >
              Eliminar
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>
      {showHistory && (
        <>
          <Historial
            data={props.pd.Historial}
            btnText="ver"
            stateHistory={setShowHistory}
            collection={props.collection}
            process={props.pd.Proceso}
          />
        </>
      )}
      {showSim && (
        <>
          <Simulator
            data={props.pd}
            stateSim={setShowSim}
            process={props.pd.Proceso}
          />
        </>
      )}
    </>
  );

  const loader = <Spinner />;
  const error = (
    <ErrorMessage
      message="No hay datos en el historial"
      severity="info"
      action={() => setError(false)}
      buttonTxt="Cerrar"
    />
  );

  return useLoading ? loader : useError ? error : viewer;
};

export default PriceTable;
