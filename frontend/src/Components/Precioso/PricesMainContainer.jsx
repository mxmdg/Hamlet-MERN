import Precioso from './Precioso'
import Form from '../Formulario/Form'
import PricesDataForm from '../Formulario/PricesDataForm'
import '../../Styles/hamlet.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';

const PricesMainContainer = ()=> {
    return (<Container>
                <Box>
                    <h3>Costos</h3>
                    <Precioso collection='precios'/>
                    <Form form={PricesDataForm} collection='precios'/>   
                </Box>
            </Container>)
}

export default PricesMainContainer  