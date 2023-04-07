import Formats from './Formats'
import Form from '../Formulario/Form'
import FormDataForm from '../Formulario/FormatDataForm'
import '../../Styles/hamlet.css'

const FormatsMainContainer = ()=> {
    return (<>
                <div>
                    <h3>Formatos</h3>
                    <Formats collection='formatos'/>
                    <Form form={FormDataForm} collection='formatos'/>   
                </div>
            </>)
}

export default FormatsMainContainer