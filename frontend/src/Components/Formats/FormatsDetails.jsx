import '../../Styles/hamlet.css'
import axios from 'axios'
import { serverURL } from '../../config'
import FormDataForm from '../Formulario/FormatDataForm'
import Form from '../Formulario/Form'
import { useState } from 'react'


const FormatsDetails = (props)=> {

    const [useAction, setAction] = useState('view')
    const [useID, setID] = useState('useID')
    const [useItemToEdit, setItemToEdit] = useState({itemToEdit: 'itemToEdit'})
    const [useFormatsList, setFormatsList] = useState([])

    const getElements = async () => {
        const formats = await axios.get(`${serverURL}/hamlet/formatos/`)
        setFormatsList(formats.data)
    }

    const deleteClickHandler = async (id)=>{
        try {
             await axios.delete(`${serverURL}/hamlet/formatos/${id}`)
             getElements()
        } catch (e) {
            alert(e)
        }
    }

    const editClickHandler = async (id)=> {
        try {
            const itemToEdit = await axios.get(`${serverURL}/hamlet/formatos/${id}`)
           setAction('edit')
           setID(itemToEdit.data._id)
           setItemToEdit(itemToEdit)
        } catch (e) {
            console.log(e)
        }
    }

    const editor =  <Form form={FormDataForm} collection='formatos' item={useItemToEdit} _id={useID}/>

    const viewer = (
                    <div className="Stockframe">
                        <h5>{props.pd.Nombre} ({props.pd.Ancho} x {props.pd.Alto})</h5>
                        <h5 className='deleteBtn' onClick={()=>editClickHandler(props.pd._id)}>Editar</h5>
                        <h5 className='deleteBtn' onClick={()=>deleteClickHandler(props.pd._id)}>Eliminar</h5>
                    </div>
                    )

    return (useAction === "view") ? viewer : editor
}

export default FormatsDetails