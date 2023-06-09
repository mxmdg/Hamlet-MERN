import Stocks from './Stocks'
import Form from '../Formulario/Form'
import StockDataForm from '../Formulario/StockDataForm'
//import '../../Styles/hamlet.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import { Typography } from '@mui/material'

const StocksMainContainer = ()=> {
    return (<Container>
                <Box>
                <Typography
          gutterBottom
          variant="h6"
          color="secondary"
          fontWeight={600}
          component="div"
        >
          Materiales
        </Typography>
                    <Stocks collection='materiales'/>
                    <Form form={StockDataForm} collection='materiales' task="new"/>   
                </Box>
            </Container>)
}

export default StocksMainContainer