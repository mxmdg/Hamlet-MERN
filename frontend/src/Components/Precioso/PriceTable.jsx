import '../../Styles/hamlet.css'
import axios from 'axios'
import { serverURL } from '../Config/config'
import Form from '../Formulario/Form'
import { useState , useEffect } from 'react'
//import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

const PriceTable = (props)=> {

    const [useAction, setAction] = useState('view')
    const [useID, setID] = useState('')
    const [useItemToEdit, setItemToEdit] = useState({})
    const [useItemsList, setItemsList] = useState([])

    const getElements = async () => {
        const items = await axios.get(`${serverURL}/hamlet/${props.collection}/`)
        setItemsList(items.data)

    }


    const deleteClickHandler = async (id)=>{
        if (window.confirm(`Estas recontra seguro de borrar ${props.pd.Nombre || props.pd.Nombre_Material || props.pd.Modelo || props.pd.Proceso }`)) {
            try {
                await axios.delete(`${serverURL}/hamlet/${props.collection}/${id}`)
                getElements()
            } catch (e) {
                alert(e)
            }
        }        
    }

    const editClickHandler = async (id)=> {
        try {
           const itemToEdit = await axios.get(`${serverURL}/hamlet/${props.collection}/${id}`)
           setAction('edit')
           setID(itemToEdit.data._id)
           setItemToEdit(itemToEdit)
           console.log("id: " + itemToEdit.data._id)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(()=>{

    },[props.formCLC])
   // const rows: GridRowsProp = props.pd

    const editor =  <Form 
                    form={props.formData} 
                    collection={props.collection} 
                    item={useItemToEdit}
                    action={setAction} 
                    _id={props.pd._id}
                    />

    const viewer = (
                    <>
                   {/*  <div className="Stockframe">
                        <h5>{props.pd.Nombre || props.pd.Nombre_Material || props.pd.Modelo || props.pd.Proceso }</h5>
                        <h5 className='deleteBtn' onClick={()=>editClickHandler(props.id)}>Editar</h5>
                        <h5 className='deleteBtn' onClick={()=>deleteClickHandler(props.id)}>Eliminar</h5>
                    </div>
                    <div> */}
                    <Paper sx={{ maxWidth: 345, background: '#88009933' }} color='primary' variant="elevation" elevation={16} square={false}>
                        <CardContent>
                            <Typography gutterBottom variant="h6" color="#e6f" fontWeight={600} component="div">
                            { props.pd.Proceso }
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ maxWidth: 350 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Proceso</TableCell>
                                            <TableCell align="right">Valor</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {Object.entries(props.formCLC).map(([key,value]) => (
                                        <TableRow
                                        key={key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="price">
                                            {key}
                                        </TableCell>
                                        <TableCell align="right">{value}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="success"onClick={()=>editClickHandler(props.id)}>Editar</Button>
                            <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={()=>deleteClickHandler(props.id)}>Eliminar</Button>
                        </CardActions>
                    </Paper>
                    </>
                    
                    )

    return (useAction === "view") ? viewer : editor
}

export default PriceTable