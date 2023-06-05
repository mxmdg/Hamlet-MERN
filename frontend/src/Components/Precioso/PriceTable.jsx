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
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "./Modal";
import Historial from "./Historial";
import LastSeen from "./LastUpdate";

const PriceTable = (props) => {
  const [useAction, setAction] = useState("view");
  const [useID, setID] = useState("");
  const [useItemToEdit, setItemToEdit] = useState({});
  const [useItemsList, setItemsList] = useState([]);
  const [useHistory, setHistory] = useState(props.pd.Historial);
  const [showHistory, setShowHistory] = useState(false);

  const getElements = async () => {
    const items = await axios.get(`${serverURL}/hamlet/${props.collection}/`);
    setItemsList(items.data);
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
        editor(true);
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
      let history = [
        {
          Valor: itemToEdit.data.Valor,
          Entrada: itemToEdit.data.Entrada,
          Minimo: itemToEdit.data.Minimo,
          Fecha: itemToEdit.data.Fecha,
        },
      ];
      console.log(history);
      setAction("edit");
      setID(itemToEdit.data._id);
      setItemToEdit(itemToEdit);
      setHistory(history);
      console.log("Historial: " + itemToEdit.Historial);
      console.log("history: " + useHistory);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {}, [props.formCLC, useAction]);
  // const rows: GridRowsProp = props.pd

  const editor = (
    <Form
      form={props.formData}
      collection={props.collection}
      item={useItemToEdit}
      history={useHistory}
      action={setAction}
      _id={props.pd._id}
      editor={props.editor}
    />
  );

  const viewer = (
    <>
      {/*  <div className="Stockframe">
                        <h5>{props.pd.Nombre || props.pd.Nombre_Material || props.pd.Modelo || props.pd.Proceso }</h5>
                        <h5 className='deleteBtn' onClick={()=>editClickHandler(props.id)}>Editar</h5>
                        <h5 className='deleteBtn' onClick={()=>deleteClickHandler(props.id)}>Eliminar</h5>
                    </div>
                    <div> */}

      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="baseline"
      >
        <Card
          sx={{ maxWidth: 345, background: "#88009933", height: "100%" }}
          color="primary"
          variant="elevation"
          elevation={16}
          square={false}
        >
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              color="#e6f"
              fontWeight={600}
              component="div"
            >
              {props.pd.Proceso}
            </Typography>
            <Typography
              gutterBottom
              variant="p"
              color="#e6f"
              fontWeight={300}
              component="p"
            >
              <LastSeen date={props.pd.Fecha} />
            </Typography>

            <TableContainer component={Paper}>
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

          <CardActions>
            <Button
              size="small"
              color="secondary"
              onClick={() => setShowHistory(true)}
            >
              Historial
            </Button>
            <Button
              size="small"
              color="success"
              onClick={() => editClickHandler(props.id)}
            >
              Editar
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteClickHandler(props.id)}
            >
              Eliminar
            </Button>
          </CardActions>
        </Card>
        {showHistory && <Historial data={useHistory} btnText="ver grafico" />}
      </Grid>
    </>
  );

  return useAction === "view" ? viewer : editor;
};

export default PriceTable;
