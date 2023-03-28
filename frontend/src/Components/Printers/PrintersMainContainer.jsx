import Printers from './Printers'
import Form from '../Formulario/Form'
import PrintersDataForm from '../Formulario/PrintersDataForm'

import './printers.css'

const PrintersMainContainer = ()=> {
    return (
             <>
             <div>
                <h3>Impresoras</h3>
                <Form form={PrintersDataForm} collection='impresoras'/>
            </div>
            <Printers/>
             </>)
}

export default PrintersMainContainer