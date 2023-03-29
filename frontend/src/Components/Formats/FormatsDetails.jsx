import '../../Styles/hamlet.css'
import axios from 'axios';

const deleteClickHandler = async (id)=>{
    try {
         await axios.delete("http://localhost:5000/hamlet/formatos/" + id)
    } catch (e) {
        alert(e)
    }
}

const FormatsDetails = (props)=> {
    return (
        <div className="Stockframe">
            <h5>{props.pd.Nombre} ({props.pd.Ancho} x {props.pd.Alto})</h5>
            <h5 className='deleteBtn' onClick={()=>deleteClickHandler(props.pd._id)}>Eliminar</h5>
        </div>
        )
}

export default FormatsDetails