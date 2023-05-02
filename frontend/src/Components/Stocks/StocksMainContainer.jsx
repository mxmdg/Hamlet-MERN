import Stocks from './Stocks'
import Form from '../Formulario/Form'
import StockDataForm from '../Formulario/StockDataForm'
import '../../Styles/hamlet.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';

const StocksMainContainer = ()=> {
    return (<Container>
                <Box>
                    <h3>Materiales</h3>
                    <Stocks collection='materiales'/>
                    <Form form={StockDataForm} collection='materiales'/>   
                </Box>
            </Container>)
}

export default StocksMainContainer