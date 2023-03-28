import Stocks from './Stocks'
import Form from '../Formulario/Form'
import FormDataForm from '../Formulario/FormatDataForm'
import '../../Styles/hamlet.css'

const StocksMainContainer = ()=> {
    return (<>
                <div>
                    <h3>Materiales</h3>
                    <Stocks/>
                    <Form form={FormDataForm} collection='formatos'/>   
                </div>
            </>)
}

export default StocksMainContainer