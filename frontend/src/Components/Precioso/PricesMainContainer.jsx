import Precioso from './Precioso'
import Form from '../Formulario/Form'
import PricesDataForm from '../Formulario/PricesDataForm'
import '../../Styles/hamlet.css'

const PricesMainContainer = ()=> {
    return (<>
                <div>
                    <h3>Costos</h3>
                    <Precioso collection='precios'/>
                    <Form form={PricesDataForm} collection='precios'/>   
                </div>
            </>)
}

export default PricesMainContainer  