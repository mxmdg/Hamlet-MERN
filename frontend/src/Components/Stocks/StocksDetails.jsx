import '../../Styles/hamlet.css'
import axios from 'axios';

const deleteClickHandler = async (id)=>{
    try {
         await axios.delete("http://localhost:5000/hamlet/materiales/" + id)
    } catch (e) {
        alert(e)
    }
}

const StocksDetails = (props)=> {
    return (
        <div className="Stockframe">
            <h5>{props.pd.Tipo} {props.pd.Gramaje} ({props.pd.Marca}, Resma {props.pd.Ancho_Resma} x {props.pd.Alto_Resma})</h5>
            <div className='deleteBtn' onClick={()=>deleteClickHandler(props.pd._id)}>X</div>
        </div>
        )
}

export default StocksDetails