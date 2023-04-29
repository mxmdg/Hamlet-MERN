import Stocks from './Stocks'
import Form from '../Formulario/Form'
import StockDataForm from '../Formulario/StockDataForm'
import '../../Styles/hamlet.css'

import Box from '@mui/material/Box'

const StocksMainContainer = ()=> {
    return (<>
                <Box>
                    <Stocks collection='materiales'/>
                    <Form form={StockDataForm} collection='materiales'/>   
                </Box>
            </>)
}

export default StocksMainContainer