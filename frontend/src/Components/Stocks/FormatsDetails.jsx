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
            <div className='deleteBtn' onClick={()=>deleteClickHandler(props.pd._id)}>X</div>
        </div>
        )
}

export default FormatsDetails