import '../../Styles/hamlet.css'
import axios from 'axios';
import { serverURL } from '../../config';

const deleteClickHandler = async (id)=>{
    try {
         await axios.delete(`${serverURL}/hamlet/materiales/${id}`)
    } catch (e) {
        alert(e)
    }
}

const StocksDetails = (props)=> {
    return (
        <div className="Stockframe">
            <h5>{props.pd.Tipo} {props.pd.Gramaje} ({props.pd.Marca}, Resma {props.pd.Ancho_Resma} x {props.pd.Alto_Resma})</h5>
            <h5 className='deleteBtn' onClick={()=>deleteClickHandler(props.pd._id)}>Eliminar</h5>
        </div>
        )
}

export default StocksDetails