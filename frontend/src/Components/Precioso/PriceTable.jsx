import "../../Styles/hamlet.css";
import axios from "axios";
import { serverURL } from "../Config/config";
import Form from "../Formulario/Form";
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
//import { DataGrid } from '@mui/x-data-grid';
import Card from "@mui/material/Card";
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
import LastSeen from "./LastUpdate";
import { useNavigate } from "react-router-dom";

const PriceTable = (props) => {
  const [useView, setView] = useState("viewer");
  const [useItemToEdit, setItemToEdit] = useState({});
  const [useTask, setTask] = useState("new");
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  const getElements = async () => {
    const items = await axios.get(`${serverURL}/hamlet/${props.collection}/`);
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
        await axios.delete(`${serverURL}/hamlet/${props.collection}/${id}`);
        getElements();
        props.editor(true);
      } catch (e) {
        alert(e);
      }
    }
  };

  const editClickHandler = async (id) => {
    try {
      const itemToEdit = await axios.get(
        `${serverURL}/hamlet/${props.collection}/${id}`
      );
      /* let history = [
        {
          Valor: itemToEdit.data.Valor,
          Entrada: itemToEdit.data.Entrada,
          Minimo: itemToEdit.data.Minimo,
          Fecha: itemToEdit.data.Fecha,
        },
      ]; */

      setTask("edit");
      setView("editor");
      setItemToEdit(itemToEdit);
      /* useHistory.push(history);

      console.log(props.priceHistory);
      console.log(useHistory); */
    } catch (e) {
      console.log(e);
    }
  };

  const handleHistory = () => {
    try {
      if (props.Historial !== undefined || props.Historial !== null) {
        setShowHistory(true);
      } else {
        alert("No hay datos en el historial");
      }
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {}, [useView, useTask, useItemToEdit]);
  // const rows: GridRowsProp = props.pd

  const editor = (
    <Form
      form={props.formData}
      collection={props.collection}
      item={useItemToEdit}
      view={setView}
      task={useTask}
      _id={props.pd._id}
      editor={props.editor}
    />
  );

  const viewer = (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="baseline"
      >
        <Card
          sx={{
            maxWidth: 350,
            minHeight: 400,
            height: "100%",
          }}
          direction="column"
          color="secondary"
          square={true}
        >
          <CardContent
            sx={{
              maxWidth: 350,
              minHeight: 400,
              height: "100%",
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              color="text.secondary"
              component="div"
            >
              {props.pd.Proceso}
            </Typography>
            <Typography
              gutterBottom
              variant="p"
              color="text.secondary"
              component="p"
            >
              <LastSeen date={props.pd.Fecha} />
            </Typography>

            <TableContainer component={Paper} elevation={8}>
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
                        ) : (
                          value
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>

          <CardActions
            sx={{
              marginTop: "auto",
              marginBottom: "15px",
              alignContent: "center",
            }}
          >
            <ButtonGroup variant="text" aria-label="text button group">
              <Button color="info" onClick={handleHistory}>
                Historial
              </Button>
              <Button
                color="success"
                onClick={() => {
                  navigate(`/hamlet/${props.collection}/edit/${props.id}`);
                }}
              >
                Editar
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
            />
          </>
        )}
      </Grid>
    </>
  );

  return useView === "viewer" ? viewer : editor;
};

export default PriceTable;
