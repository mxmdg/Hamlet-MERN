import '../../Styles/hamlet.css'
import axios from 'axios'
import { serverURL } from '../../config'
import Form from '../Formulario/Form'
import { useState } from 'react'
//import { DataGrid } from '@mui/x-data-grid';

const ItemsDetails = (props)=> {

    const [useAction, setAction] = useState('view')
    const [useID, setID] = useState('')
    const [useItemToEdit, setItemToEdit] = useState({})
    const [useItemsList, setItemsList] = useState([])

    const getElements = async () => {
        const items = await axios.get(`${serverURL}/hamlet/${props.collection}/`)
        setItemsList(items.data)
        console.table(items.data)
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
                    <div className="Stockframe">
                        <h5>{props.pd.Nombre || props.pd.Nombre_Material || props.pd.Modelo || props.pd.Proceso }</h5>
                        <h5 className='deleteBtn' onClick={()=>editClickHandler(props.id)}>Editar</h5>
                        <h5 className='deleteBtn' onClick={()=>deleteClickHandler(props.id)}>Eliminar</h5>
                    </div>
                    </>
                    )

    return (useAction === "view") ? viewer : editor
}

export default ItemsDetails